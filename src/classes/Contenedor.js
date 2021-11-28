import fs from 'fs';
import __dirname from '../utils.js';

const prodUrl = __dirname+'/files/products.txt'

class Contenedor{
    async registrarProd(prod){
        try{
            let data = await fs.promises.readFile(prodUrl,'utf-8');
            let products = JSON.parse(data);
            let id = products[products.length-1].id+1;
            prod =Object.assign({id:id},prod);
            products.push(prod)
            try{
                await fs.promises.writeFile(prodUrl,JSON.stringify(products,null,2));
                return {status:"success",message:"Producto registrado"}
            }catch{
                return {statis:"error",message:"Producto no registrado"} 
            }
        }catch{
            prod = Object.assign({id:1},prod)
            try{
                await fs.promises.writeFile(prodUrl,JSON.stringify([prod],null,2));
                return {status:"success", message:"Producto registrado."}
            }
            catch{
                return {status:"error",message:"Producto no registrado."}
            }
        }
    }
    async getAll(){
        try{
            let data = await fs.promises.readFile(prodUrl,'utf-8');
            let products = JSON.parse(data);
            return {status:"success",payload:products}
        }catch{
            return {status:"error",message:"Error al obtener los productos solicitados."}
        }
    }
    async getProdById(id){
        try{
            let data = await fs.promises.readFile(prodUrl,'utf-8');
            let products = JSON.parse(data);
            let prod = products.find(p => p.id===id)
            if(prod){
                return {status:"success", payload:prod}
            }else{
                return {status:"error",message:"Producto encontrado."}
            }
        }catch{
            return {status:"error",message:"Producto no encontrado."}
        }
    }
    async updateProd(id,body){
        try{
            let data = await fs.promises.readFile(prodUrl,'utf-8');
            let products = JSON.parse(data);
            if(!products.some(prod=>prod.id===id)) return {status:"error", message:"No hay productos con el ID solicitado."}
            let result = products.map(prod=>{
                if(prod.id===id){
                    if(prod){
                        body = Object.assign(body,{title:prod.title, price:prod.price, thumbnail:prod.thumbnail})
                        body = Object.assign({id:prod.id,...body});
                        return body;
                    }
                    else{
                        body = Object.assign({id:id,...body})
                        return body;
                    }
                }else{
                    return prod;
                }
            })
            try{
                await fs.promises.writeFile(prodUrl,JSON.stringify(result,null,2));
                return {status:"success", message:"Producto actualizado."}
            }catch{
                return {status:"error", message:"Error al actualizar el producto."}
            }
        }catch(error){
            return {status:"error",message:"Error al actualizar el producto: "+error}
        }
    }
    async deleteProd(id){
        try{
            let data = await fs.promises.readFile(prodUrl,'utf-8');
            let products = JSON.parse(data);
            if(!products.some(prod=>prod.id===id)) return {status:"error", message:"No se encuentra el ID solicitado."}
            let prod = products.find(p=>p.id===id);
            if(prod){
                try{
                    let prodData = await fs.promises.readFile(prodUrl,'utf-8');
                    let products = JSON.parse(prodData);
                    products.forEach(prod=>{
                        if(prod.id===id){
                            delete prod['prod']
                        }
                    })
                    await fs.promises.writeFile(prodUrl,JSON.stringify(products,null,2));
                }catch(error){
                    return {status:"error", message:"Error al eliminar el producto: "+error}
                }
            }
            let prodtest = products.filter(p=>p.id!==id);
            try{
                await fs.promises.writeFile(prodUrl,JSON.stringify(prodtest,null,2));
                return {status:"success",message:"Producto eliminado."}
            }catch{
                return {status:"error", message:"Producto no eliminado."}
            }
        }catch{
            return {status:"error", message:"Error al eliminar el producto."}
        }
    }

}

export default Contenedor;
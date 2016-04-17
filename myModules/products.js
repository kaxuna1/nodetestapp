/**
 * Created by kaxa on 4/17/16.
 */
this.getProducts=function(request, reply,http,databases,page){
    databases.Products.pages(function (err, pages) {
        var returnData={};
        returnData["totalPages"]=pages;
        databases.Products.page(page).order("name").run(function (err, products) {
            returnData["content"]=products;
            reply(returnData);
        });
    })
};
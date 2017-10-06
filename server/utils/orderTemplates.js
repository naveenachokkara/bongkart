var moment = require('moment');
var _ = require('underscore');
module.exports = {
    getOrderConformation: function(user,order){
        var html = `
        <div style="width: 500px;background-color: #F2F2F2;font-family: arial,sans-serif;">
            <div style="background: #EF6563;padding: 20px;font-size: 20px;color: #FFFFFF;text-align: center;">Order Confirmation</div>
            <div style="padding: 10px;">
                <table cellspacing="0" cellpadding="0" style="width:100%;padding-top:10px">
                    <tbody>
                        <tr>
                            <td style="color:#29303f;text-align:left;background-color:#fff;padding:30px 10px 10px;font-size:14px;border:1px solid #ddd;border-radius:6px">
                                <p style="margin-top:0">Hi `+user.userName+`</p>
                                <p>Thank you for shopping on Bongkart.</p>
                                <p style="color:#94989f"> Order number: `+order._id+`
                                    <br> Received on: 
                                    <strong> <span class="aBn" data-term="goog_383867432" tabindex="0"><span class="aQJ">`+moment(order.created).format("ddd,  Do MMM YYYY")+`</span></span> </strong>
                                </p>  
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table cellspacing="0" cellpadding="0" style="width:100%;font-size: 14px;background: #FFFFFF;background-color: #fff;border: 1px solid #ddd;border-radius: 6px;margin: 5px 0px;">
                    <thead>
                        <tr style="background: #EF6563;color: #FFFFFF;">
                            <th style="padding: 8px;">Product</th>
                            <th>Quantity</th>
                            <th style="background: black;">Price/Unit</th>
                        </tr>
                    </thead>
                    <tbody>`;

            var items = order.items;
            var itemsLength = items.length;
            var products = order.products;
            _.each(items, function (item) {
                var product = _.find(products, function (product) {
                    return product._id.equals(item.bongId);
                })
                html += `<tr>
                            <td style="border-bottom: 1px solid #e8e4e4;padding: 10px;">
                                <img src="`+ (product.images && product.images.length && product.images[0].imageUrl) + `" style="height: 75px;display: inline-block;">
                                <div style="display: inline-block;vertical-align: top;padding: 10px;">`+ product.title + `</div>
                            </td>
                            <td style="border-bottom: 1px solid #e8e4e4;text-align: center;">`+ item.quantity + `</td>
                            <td style="border-bottom: 1px solid #e8e4e4;text-align: center;">`+ item.price + `</td>
                         </tr>`
            });
            html+=`</tbody>
            </table>
            <table cellpadding="0" cellspacing="0" style="text-align:left;width:100%;background-color:#fff;border:1px solid #ddd;border-radius:6px">
                <tbody>
                    <tr>
                        <td style="padding:10px">
                            <table style="color:#94989f;width:100%;font-size:14px" cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                        <td style="color: #000;">Bill Details</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:5px 0;"> Order value </td>
                                        <td style="color:#29303f;text-align:right"> Rs. `+order.totalAmount+`</td>
                                    </tr>                                                 
                                    <tr>
                                        <td style="padding:5px 0">Tax</td>
                                        <td style="text-align:right;color:#29303f"> Rs. `+order.tax+`</td>
                                    </tr>                                                 
                                    <tr>
                                        <td style="padding:5px 0"> Shipping charge </td>
                                        <td style="color:#0bc6a0;text-align:right"> Free </td>
                                    </tr>                                                                                                      
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-top:1px solid #e4e4e4;padding:0 10px;height:50px">
                            <table style="width:100%;font-weight:bold;font-size:16px;color:#29303f" cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                        <td style="width:70px;color:#94989f">Total</td>
                                        <td style="text-align:right;vertical-align:baseline"> <span style="vertical-align:middle">  Rs. `+order.totalAmount+`</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table cellpadding="0" cellspacing="0" style="text-align:left;width:100%;padding:0;background-color:#fff;border:1px solid #ddd;border-radius:6px;margin-top:5px;">
                <tbody>
                    <tr>
                        <td style="font-size:14px;color:#94989f;padding:15px 10px;">
                            <p style="color: black;">Delivery Details</p>
                            <p style="color:#29303f;margin-top:0px">`+order.address.name+`</p>
                            <p> `+order.address.address+`
                                <br>` +order.address.city+` 
                                <br> PIN Code - `+order.address.pincode+` 
                            </p>
                            <p style="margin-bottom:0"> Mobile: `+order.address.phoneNumber+` </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`;
    return html;
},
getCancelOrderedItems: function(user,order,cancelledItems){
        var html = `
        <div style="width: 500px;background-color: #F2F2F2;font-family: arial,sans-serif;">
            <div style="background: #EF6563;padding: 20px;font-size: 20px;color: #FFFFFF;text-align: center;">Order Cancellation</div>
            <div style="padding: 10px;">
                <table cellspacing="0" cellpadding="0" style="width:100%;padding-top:10px">
                    <tbody>
                        <tr>
                            <td style="color:#29303f;text-align:left;background-color:#fff;padding:30px 10px 10px;font-size:14px;border:1px solid #ddd;border-radius:6px">
                                <p style="margin-top:0;font-weight:bold;">Hi `+user.userName+`,</p>
                                <p style="color:#94989f"> We would like to inform you that we have processed your cancellation request for the following items in the Order `+order._id+`
                                </p>  
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table cellspacing="0" cellpadding="0" style="width:100%;font-size: 14px;background: #FFFFFF;background-color: #fff;border: 1px solid #ddd;border-radius: 6px;margin: 5px 0px;">
                    <thead>
                        <tr style="background: #EF6563;color: #FFFFFF;">
                            <th style="padding: 8px;">Product</th>
                            <th>Quantity</th>
                            <th style="background: black;">Price/Unit</th>
                        </tr>
                    </thead>
                    <tbody>`;

            var items = order.items;
            var itemsLength = items.length;
            var products = order.products;
            _.each(items, function (item) {
                if (_.find(cancelledItems, function (cancelledItem) { return item.bongId.equals(cancelledItem) })) {
                    var product = _.find(products, function (product) {
                        return product._id.equals(item.bongId);
                    });
                    html += `<tr>
                            <td style="border-bottom: 1px solid #e8e4e4;padding: 10px;">
                                <img src="`+ (product.images && product.images.length && product.images[0].imageUrl) + `" style="height: 75px;display: inline-block;">
                                <div style="display: inline-block;vertical-align: top;padding: 10px;">`+ product.title + `</div>
                            </td>
                            <td style="border-bottom: 1px solid #e8e4e4;text-align: center;">`+ item.quantity + `</td>
                            <td style="border-bottom: 1px solid #e8e4e4;text-align: center;">`+ item.price + `</td>
                         </tr>`;
                }
            });
            html+=`</tbody>
            </table>
        </div>
    </div>`;
    return html;
    }
};
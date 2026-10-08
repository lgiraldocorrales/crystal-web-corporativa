
        var updateBtns=document.getElementsByClassName('update-cart')


        for(var i = 0; i < updateBtns.length; i++){
            updateBtns[i].addEventListener('click', function(){
                var unidad =this.dataset.unidad
                var productId = this.dataset.product
                var action = this.dataset.action
                })
        }

        function addCookieItem(productId, action,unidad){
            if(action == 'add'){
                
                
                if(cart[productId] == undefined){
                    M.toast({html: 'Adicionó un producto', classes: 'rounded'})
                    cart[productId] = {'quantity':1}
                }else{
                    if(cart[productId]['quantity']==unidad){
                        M.toast({html: 'Excedes el limite de compra de este producto', classes: 'rounded'})
                        cart[productId]['quantity']
                    }else{
                        M.toast({html: 'Adicionó un producto', classes: 'rounded'})
                        cart[productId]['quantity'] += 1
                    }
                    
                }
            }

            if(action == 'remove'){
                M.toast({html: 'Eliminó un producto', classes: 'rounded'})
                cart[productId]['quantity'] -= 1

                if(cart[productId]['quantity'] <= 0){
                    delete cart[productId]
                }
            }
            document.cookie = 'cart=' + JSON.stringify(cart) + ";domain=;path=/"
            
            setTimeout(function(){ location.reload(); }, 1000);
           
        }

        function updateUserOrder(productId,action){
            var url='/update_item/'

            fetch(url, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'X-CSRFToken':csrftoken,
                },
                body:JSON.stringify({'productId': productId, 'action':action})
            })

            .then((response)=>{
                return response.json()
            })

            .then((data)=>{
                location.reload()
            })
        }
        $('.carousel.carousel-slider').carousel({
            fullWidth: true,
            indicators: true
        });
    
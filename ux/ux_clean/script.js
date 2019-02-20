$(document).ready(function(){
    var avatar = document.getElementById("avatar");
    avatar.addEventListener("click", function(){
        avatar.style.right = "-50%";
        document.getElementById("chat").style.right = "0";
    });

    var chat_close = document.getElementById("chat_head_close");
    chat_close.addEventListener("click", function(){
        document.getElementById("chat").style.right = "-110%";
        avatar.style.right = "0";
    });


    $("#post-btn").on("click", function(){
        http_request = new XMLHttpRequest();
        http_request.onreadystatechange = function(){
            if(http_request.readyState == XMLHttpRequest.DONE){
                var json = JSON.parse(http_request.responseText);
                console.log(json)
                // alert(json["fulfillment"]["speech"]);
                // alert(json.fulfillment.speech);
            }
        };
        http_request.open("POST", "http://turing2019.azurewebsites.net/api/Chat");
        http_request.withCredentials = false;
        // http_request.setRequestHeader("Access-Control-Allow-Headers", "*")
        http_request.setRequestHeader("Content-Type", "application/json");
        // http_request.setRequestHeader("Access-Control-Allow-Origin", "*");
        http_request.send("\"ciao\"");
    });

    // const postBtn = document.getElementById('post-btn');
    // var msg = "ciao";
    // var url = "http://fitstic2019-001-site1.etempurl.com/api/Chat";
    // postBtn.addEventListener('click', async _ => {
    //     try {     
    //         const response = await fetch(url, {
    //             method: 'post',
    //             body: msg   
    //         });
    //         console.log('Completed!', response);
    //     } catch(err) {
    //         console.error(`Error: ${err}`);
    // }
    // });
});
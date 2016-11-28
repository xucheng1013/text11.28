<?php 
   require_once("jssdk.php");

//AppID(应用ID)wx6341f19839559cbc
//AppSecret(应用密钥)8f8a2ca17c337bc9d920b6e0c8dca347 


//AppID(应用ID)wx5d6076433954c310
//AppSecret(应用密钥)39c86881e9befe1d3c4982b0b41147dd
   $sdk = new JSSDK("wx6341f19839559cbc","8f8a2ca17c337bc9d920b6e0c8dca347");
   $config =  $sdk -> getSignPackage($_POST["url"]);

   echo json_encode($config);//'{a:12,n:44}' 
?>

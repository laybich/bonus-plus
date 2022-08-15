<?php
session_start();

$products = array();
if(isset($_POST['products_list'])) {
	if($_POST['products_list'] !== '[]') {

		$products_list = json_decode($_POST['products_list']);

		for($i = 0; $i < count($products_list); $i++) {
			$products[$i] = array(
				'product_id' => $products_list[$i][1]->id,
				'price'      => $products_list[$i][1]->price,
				'amount'      => $products_list[$i][1]->count,
			);
		}
	}
}

$products = urlencode(serialize($products));

// параметры запроса
$data = array(
	'api_key'         => 'e6fd686e5efc56c82c14d02be0fd4e656b0bb656',               // Ваш секретный токен
	'products'        => $products,                         // массив с товарами в заказе
	'bayer_fio'       => $_REQUEST['name'],                 // покупатель (Ф.И.О)
	'phone'           => $_REQUEST['phone'],                // телефон
	'email'           => '',                // e-mail
	'status'          => '4',                               // id статуса в crm-системе, по умолчанию "Новый"
	'delivery_type'   => '12',                              // способ доставки (id в CRM)
	'client_comment'  => '',              // комментарий клиента
	'client_ip'       => $_SERVER['REMOTE_ADDR'],           // IP адрес клиента
	'payment_type'    => '15',                              // вариант оплаты (id в CRM)
	'additional_field'=> '',     // доплнительное поле
	'utm_source'      => '',   // utm_source
	'utm_medium'      => '',   // utm_medium
	'utm_term'        => '',     // utm_term
	'utm_content'     => '',  // utm_content
	'utm_campaign'    => '', // utm_campaign
	'store_url'       => $_SERVER['SERVER_NAME']            // store_url
);

// запрос
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://programbonus.trendcrm.biz/api/landing/order');
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
$out = curl_exec($curl);
curl_close($curl);

?>

<!DOCTYPE html>
<html>
<head lang="en">
	<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
	<meta charset="UTF-8">
	<title>Спасибо за заказ!</title>
	<meta name="viewport" content="width=device-width">
	<style type="text/css">

	html { font-family: sans-serif; }
	body { margin: 0px; }
	audio:not([controls]) { display: none; height: 0px; }
	svg:not(:root) { overflow: hidden; }
	button::-moz-focus-inner, input::-moz-focus-inner { border: 0px none; padding: 0px; }
	* { box-sizing: border-box; }
	*::before, *::after { box-sizing: border-box; }
	html { font-size: 10px; }
	body { font-family: "Helvetica Neue",Helvetica,Arial,sans-serif; font-size: 14px; line-height: 1.42857; color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); }
	.container { margin-right: auto; margin-left: auto; padding-left: 15px; padding-right: 15px; }

	* { margin: 0px; padding: 0px; box-sizing: border-box; }
	@font-face {
		font-family: "OpenSans";
		src: url('opensans.ttf');
	}
	@font-face {
		font-family: "OpenSansBold";
		src: url('opensansbold.ttf');
	}
	@font-face {
		font-family: "OpenSansItalic";
		src: url('opensansitalic.ttf');
	}
	@font-face {
		font-family: "OpenSansExtraBold";
		src: url('opensansextrabold.ttf');
	}
	@font-face {
		font-family: "OpenSansSemiBold";
		src: url('opensanssemibold.ttf');
	}
	html, body { height: 100%; width: 100%; }
	body { background: rgb(234, 234, 234) url('bg.jpg') no-repeat scroll 50% 0px / cover ; text-align: center; padding: 50px; }
	#cont { margin-top: 150px; display: inline-block; margin-right: auto; margin-left: auto; }
	#ty { font-size: 4em; font-family: "OpenSansExtraBold"; color: rgb(66, 156, 98); line-height: 2em; text-align: center; margin: 0px auto 25px; padding-bottom: 15px; border-bottom: 1px solid rgb(0, 0, 0); width: 75%; }
	.ty { font-size: 3em; font-family: "OpenSansSemiBold"; color: rgb(53, 53, 53); line-height: 1.2em; text-align: center; }
	@media screen and (max-width: 680px) {
		#cont { margin-top: 10px; }
		#ty { font-size: 3em; line-height: 0.8em; width: auto; display: inline-block; padding: 0px 20px 15px; margin-bottom: 100px; }
		.ty { font-size: 2em; line-height: 1em; margin-bottom: 20px ! important; }
		body { padding-top: 5px; padding-right: 5px; padding-left: 5px; padding-bottom: 20px ! important; }
		@media screen and (max-width: 500px) {
		#cont { margin-top: 50px; }
		#ty { width: auto; display: inline-block; padding: 0px 20px 15px; margin-bottom: 80px; }
		.ty { line-height: 1em; }
		body { background-position: 35% 0px; padding: 5px; }
	}
	}

	</style>
</head>
<body style="
			background: #FAFAD2 url(images/bg.jpg); /* Цвет фона и путь к файлу */
			color: #000000; /* Цвет текста */
			">
	<div class="block_success">
	<center>
		<h2 style="text-transform: uppercase;">
			Поздравляем! Ваш заказ принят!
		</h2>
		<p class="success">
			В ближайшее время с вами свяжется оператор для подтверждения заказа.
			Пожалуйста, включите ваш контактный телефон.
		</p>
		<h3 class="success">
			Пожалуйста, проверьте правильность введенной Вами информации.
		</h3>
		<div class="success">
			<ul class="list_info">
				<span>ФИO: </span><span id="client"><?php echo $_REQUEST['name']; ?></span>
				<br>
				<span>Телефон: </span><span id="tel"><?php echo $_REQUEST['phone']; ?></span>
			</ul>
			<br/>
			<span id="submit"></span>
		</div>
		<p class="fail success">
			Если вы ошиблись при заполнени формы, то, пожалуйста,
			<a href="http://<?php echo $_SERVER['SERVER_NAME'];?>">
				заполните заявку еще раз
			</a>
		</p>
	</center>
</div>

<script>localStorage.removeItem('products_list')</script>
</body>
</html>
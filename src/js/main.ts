"use strict";
$(() => {
class App {
	basket: Basket;

	constructor() {
		this.basket = null;
		this.BurgerMenuInit();
		this.TimerInit();
		this.BasketInit();
	}

	BurgerMenuInit():void {
		function is_touch_device() {
			return !!('ontouchstart' in window        // works on most browsers 
			|| navigator.maxTouchPoints);       // works on IE10/11 and Surface
		};

		let burger:JQuery<HTMLElement> = $('#ctg-s');
		if(is_touch_device()) {
			burger.on('touchend', () => $('#submenu').toggleClass('active'));
			$('#submenu').on('touchend', () => $(this).removeClass('active'));
		} else {
			burger.on('mouseenter', () => $('#submenu').addClass('active'));
			burger.on('mouseleave', () => $('#submenu').removeClass('active'));
		}	
		
	}

	TimerInit():void {
		let getTimeRemaining = (endtime:string) => String(Date.parse(endtime) - Date.parse(String(new Date())));

		let startTime = new Date(+getTimeRemaining('2021-' + ('0' + (new Date().getMonth() + 2)).slice(-2) + '-01'));
		$('#counter').countdown({
			image: './img/digits.png',
			startTime: `${('0' + startTime.getDate()).slice(-2)}:${('0' + startTime.getHours()).slice(-2)}:${('0' + startTime.getMinutes()).slice(-2)}:${('0' + startTime.getSeconds()).slice(-2)}`
		});
	}

	BasketInit():void {
		this.basket = new Basket();
		let basket = this.basket;

		// $('.basket-icon').removeClass('loading');

		$('body').on('click', '.btn-basket', function() {
			let Id = Number($(this).data('target'));
			basket.Clear();
			basket.AddProduct(Id);
		});
		$('body').on('click', '[href="#close"]', () => {
			basket.Clear();
		});
		// $('body').on('click', '.basket-product-del', function() {
		// 	let Id = Number($(this).parent().attr('id'));
		// 	basket.RemoveProduct(Id);
		// });
		// $('body').on('click', '.basket-product-plus', function() {
		// 	let Id = Number($(this).parent().parent().attr('id'));
		// 	basket.IncCount(Id);
		// });
		// $('body').on('click', '.basket-product-minus', function() {
		// 	let Id = Number($(this).parent().parent().attr('id'));
		// 	basket.DecCount(Id);
		// });
	}
}

class Basket {
	totalPrice: number;
	productsList: Map<number, Product>;
	xhr: XMLHttpRequest;

	constructor() {
		this.totalPrice = 0;
		this.productsList = new Map();

		this.xhr = new XMLHttpRequest();
		this.xhr.open('GET', '/prodcts.xml');
		this.xhr.responseType = 'document';
		this.xhr.send();

		this.xhr.onload = () => {
			if(localStorage.getItem('products_list') != null) {
				this.productsList = new Map(JSON.parse(localStorage.getItem('products_list')));			
				for(let product of this.productsList.values()) this.AddProduct(product.id, product.count);
			}
		}
	}

	AddProduct(Id:number, count:number = 1) {
		let productXhr = this.xhr.response.querySelector(`product[id="${Id}"]`);
		let product = new Product(Id, productXhr.querySelector('title').innerHTML, productXhr.querySelector('price').innerHTML, productXhr.querySelector('img').getAttribute('src'), count);

		this.productsList.set(Id, product);
		$('#basket .basket-products').append(`<div class="basket-product" id="${Id}"><div class="basket-product-thumb"><div class="basket-product-imgdiv" style="background-image:url(${product.preview});"></div></div><div class="basket-product-title"><a href="/products/prodct${Id}.html" target="_blank">${product.title}</a></div><div class="basket-product-plusminus"><span class="basket-product-minus"><img src="/img/minus.svg" style="width:16px;height:16px;border:0"></span><span class="basket-product-quantity">${product.count}</span><span class="basket-product-plus"><img src="/img/plus.svg" style="width:16px;height:16px;border:0"></span></div><div class="basket-product-amount">${product.price * product.count} грн.</div><div class="basket-product-del"><img src="/img/remove.svg" style="width:20px;height:20px;border:0;"></div></div>`)
		
		this.CommitBasket();
	}

	RemoveProduct(Id: number) {
		let product = $('#'+Id);
		product.remove();
		this.productsList.delete(Id);

		this.CommitBasket();
	}

	IncCount(Id: number) {
		$(`#${Id} .basket-product-quantity`).html(String(++this.productsList.get(Id).count));
		$(`#${Id} .basket-product-amount`).html(`${this.productsList.get(Id).count * this.productsList.get(Id).price} грн`);

		this.CommitBasket();
	}
	DecCount(Id: number) {
		$(`#${Id} .basket-product-quantity`).html(String(--this.productsList.get(Id).count));
		$(`#${Id} .basket-product-amount`).html(`${this.productsList.get(Id).count * this.productsList.get(Id).price} грн`);

		this.CommitBasket();
	}

	TotalPrice(): number {
		let totalPrice = 0;
		for(let product of this.productsList.values()) totalPrice += product.price * product.count;

		return totalPrice;
	}

	CommitBasket() {
		localStorage.setItem('products_list', JSON.stringify(Array.from(this.productsList.entries())));
		$('#products_list').attr('value', JSON.stringify(Array.from(this.productsList.entries())));
		$('#basket-counter').html(String(this.productsList.size));
		$('#basket-counter').attr('data-amount', this.productsList.size);
		$('#total-price').html(`${this.TotalPrice()} грн`)
	}

	Clear() {
		this.productsList.clear();
		this.CommitBasket();
		localStorage.clear();
	}
}

class Product {
	id: number;
	title: string;
	price: number;
	preview: string;
	count: number;

	constructor(Id:number, title:string, price:number, preview:string, count:number = 1) {
		this.id = Id;
		this.title = title;
		this.price = price;
		this.preview = preview;
		this.count = count;
	}
}

var app = new App();

});
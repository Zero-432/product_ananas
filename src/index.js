const axios = require("axios"); // Dùng để tải html về
const cheerio = require("cheerio"); // Dùng để phân tích html
var fs = require('fs');

const urls = [
	"https://ananas.vn/product-list/",
	"https://ananas.vn/product-list/?gender=men",
	"https://ananas.vn/product-list/?gender=women",
	"https://ananas.vn/product-list?gender=women&category=&attribute=vintas",
	"https://ananas.vn/product-list?gender=women&category=&attribute=vintas,urbas"
];
const AxiosInstance = axios.create();
var products_list = [];

urls.forEach(url => {
	// Get url
	AxiosInstance.get(url)
		// Lấy được data về
		.then(res => {
			const html = res.data;
			const $ = cheerio.load(html); // Load the HTML string into cheerio
			// lấy 1 sản phẩm
			$('div.item').each((i, el) => {
				products_list.push({
					// lấy tiêu đề
					title: $(el).find('h3.name > a').text().trim(),
					// lấy màu
					color: $(el).find('h3.color').text().trim(),
					// lấy hình
					image: $(el).find('div.cont-item > a').find('img').attr('src'),
					// lấy giá hiện tại
					// xóa thẻ span chứa % giảm giá, sau đó lấy text
					current_price: $(el).find('h3.price').children().remove().end().text().trim().slice(0, -1),
					// // lấy giá gốc
					// original_price: $(el).find('span.price-regular').text().trim().slice(0, -1),
					// // get % off
					// off: $(el).find('span.sale-tag').text().trim().slice(0, -1).slice(1)
				});
			});
			// xuất ra màn hình
			console.log(products_list);
			console.log('number of items', products_list.length);

			// Xuất ra file
			var str = JSON.stringify(products_list, null, 4);
			fs.writeFile('output/data.json', str, 'utf8', function (err) {
				if (err) {
					console.log(err);
				}
			});
		})
		.catch(console.error); // Lỗi
});

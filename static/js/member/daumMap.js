const searchAddress = () => {
	cancelAddress();
	let width = 400;
	let height = 500;
	new daum.Postcode({
		width: width,
		height: height,
		oncomplete: function(data) {
				document.querySelector('#zonecode').value = data.zonecode;
				document.querySelector('#default-address').value = data.address;
				const elZonecode = document.querySelector('#zonecode');
				const elDefaultAddress = document.querySelector('#default-address');
				elZonecode.classList.add('newData');
				elDefaultAddress.classList.add('newData');
		}
}).open({
	left: (window.screen.width / 2) - (width / 2),
	top: (window.screen.height / 2) - (height / 2)
});
}

const cancelAddress = () => {
	document.querySelector('#zonecode').value = "";
	document.querySelector('#default-address').value = "";
}


function rotateSearchAddressBtn(status) {
	document.querySelector('#address-search-btn').disabled = status;
}
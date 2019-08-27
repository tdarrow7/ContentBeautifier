let downloadArray = [],
	errorArray = [];

	console.log('inside v2');

// run through the HTML and Reformat EVERYTHING
function reformatEverythingEverywhere(element) {

	
	// let parentN = element.parentNode;
	
	let allElms = element.querySelectorAll('*'),
		h1Tags = element.querySelectorAll('h1');

	allElms.push(element);
	
	VerifySingleH1(h1Tags);
	swapElTypes(element.querySelectorAll('b'), 'strong');
	swapElTypes(element.querySelectorAll('i'), 'em');
	
	// remove all classes and styles for all elements
	removeAttribute(allElms, 'class');
	removeAttribute(allElms, 'style');

	// recall all elements after doing modifications
	allElms = element.querySelectorAll('*');
	allElms.push(element);
	// check phone number formatting in text
	restructureTele(allElms);

	// recall all elements after checking for phone numbers
	allElms = element.querySelectorAll('*');
	allElms.push(element);
	switchStatements(allElms);
}

// general function to swap legacy/incorrect elements with appropriate element equivalent
function swapElTypes(listofElms, nameOfElm) {
	for (let i = 0; i < listofElms.length; i++) {
		let replaceTag = document.createElement(nameOfElm);
		replaceTag.innerHTML = listofElms[i].innerHTML;
		listofElms[i].parentNode.replaceChild(replaceTag, listofElms[i]);
	}
}

function switchStatements(nodeList){
	for (let i = 0; i < nodeList.length; i++){
		let nodeType = nodeList[i].nodeName;

		switch(nodeType)
		{
			case "SPAN": 
				// if span is a child of a paragraph or list, get rid of span element and keep text
				let parentN = nodeList[i].parentNode,
					removeSpanIf = ["UL", "OL", "LI", "P"];
				if (removeSpanIf.includes(parentN.nodeName))
					nodeList[i].outerHTML = nodeList[i].innerHTML;
				break;
			case "BR":
				let parentN2 = nodeList[i].parentNode,
					reformatBrIf = ["P"];
				if (reformatBrIf.includes(parentN2.nodeName)){
					let newPTagList = parentN2.innerHTML.split("<br>");
					newPTagList = newPTagList.map(createNewP);
					let pTagsConcat = newPTagList.join();
					parentN2.outerHTML = pTagsConcat;
				}
				break;
			case "IMG":
				handleImageElement(nodeList[i]);
				// reset 'downloadArray' for new downloadArray items
				downloadArray = [];
				break;
			case "A":
				handleLinkElement(nodeList[i]);
				break;
		}

		//-------------WAS INITIALLY "removeExtraNodes" function-------------//

		// remove HTML comments
		nodeList[i].innerHTML = nodeList[i].innerHTML.replace(/<!--.*?-->/g, "");
		// replace non-breaking spaces with spaces
		nodeList[i].innerHTML = nodeList[i].innerHTML.replace(/&nbsp;/g, " ");
		// get match list of words/numbers that are not spaces/carriage returns/tabs/new lines
		let temp = nodeList[i].innerText.match(/[^\s\r\t\n]+/g);
		
		// if no matches (no 'words') exist
		if (temp === null || (temp.length == 1 && temp[0].length == 1)) {
			nodeList[i].remove();
		}

		//-------------------------------------------------------------------//
		// download everything in downloadArray
		downloadAllItems(0);
	}
	
}

// creates '<p>' tag with innerHTML equal to 'string'
function createNewP(string) {
	let newP = document.createElement("p");
	newP.innerHTML = string;
	return newP;
}

// checks/handles element to make sure there is only one H1 header
function VerifySingleH1(elArray) {
	elArray.unshift();
	if (elArray.length > 0) 
		swapElTypes(elArray, 'h2');
}

// cycle through all items with classes and remove the classes
function removeAttribute(elmArray, attrName) {
	for (let i = 0; i < elmArray.length; i++) {
		elmArray[i].removeAttribute(attrName);
	}
}

// handle found image element
function handleImageElement(element) {
	element.removeAttribute('width');
	element.removeAttribute('height');
	if (element.style.float != -1)
		(element.style.float == 'left') ? element.classList.add('media-left') : element.classList.add('media-right');
	if (!element.hasAttribute('alt'))
		element.setAttribute('alt', "");
	checkExtensions(element.src);
}

function restructureTele(nodeList) {
	// list of telephone number 'nodes' that need "tel: " links
	let teleNodeList = [];
	for (let i = 0; i < nodeList.length; i++) {
		// searches for phone number with various formats
		if ((/\(?[[0-9]{3}[\.\-\)]{1}[0-9]{3}[\.\-]{1}[0-9]{4}/g).exec(nodeList[i].innerHTML)) {
			// add node to teleNodeList if innerHTMl doesn't have "tel:" link in it
			if (nodeList[i].outerHTML.search("tel:") == -1) {
				teleNodeList.push(nodeList[i]);
			}
		}
	}
	// takes teleNodeList, strips each number of special characters, then creates a link for that node
	for (let i = 0; i < teleNodeList.length; i++) {
		let updatedTeleLinkNodes = [];
		updatedTeleLinkNodes = teleNodeList[i].innerHTML.match(/\(?[[0-9]{3}[\.\-\)]{1}[0-9]{3}[\.\-]{1}[0-9]{4}/g);
		for (let j = 0; j < updatedTeleLinkNodes.length; j++) {
			// create anchor/link tag
			let a = document.createElement("a");
			a.href = "tel:" + updatedTeleLinkNodes[j].replace(/[\.\(\)\-]/g, "");
			// populate anchor tag link area with new cleaned up number
			a.innerHTML = updatedTeleLinkNodes[j];
			// replace old node with newly made node with link
			teleNodeList[i].innerHTML = teleNodeList[i].innerHTML.replace(updatedTeleLinkNodes[j], a.outerHTML);
		}
	}
}

// check if link is a useful link to process
function handleLinkElement(el) {
		let href = el.getAttribute('href');
		if (href != 'javascript:void(0)' && href != null)
			checkExtensions(href);
}

// check if src is a downloadable thing
function checkExtensions(src) {
	let acceptedExtns = [['jpg', 'image/jpeg'], ['jpeg', 'image/jpeg'], ['jpg', 'image/jpeg'], ['pdf', 'application/pdf'], ['xls', '/application/vnd.ms-excel'], ['doc', 'application/msword'], ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], ['csv', '	text/csv']]
	for (let j = 0; j < acceptedExtns.length; j++) {
		if (src.includes(acceptedExtns[j][0])) {
			downloadArray.push([src, acceptedExtns[j][1]]);
			break;
		}
	}
}


// recursively download all items from array
function downloadAllItems(i) {
	if (i < downloadArray.length) {
		setTimeout(function () {
			downloadElement(downloadArray[i]);
			i++;
			downloadAllItems(i);
		}, 100);
	}
}

// download element
function downloadElement(el) {
	let fullPath = (el[0].includes('?') ? el.split('?')[0] : el[0]),
		fileName = fullPath.replace(/^.*[\\\/]/, ''),
		fileParts = fileName.split('.');
	download(fileParts[0], fileName, el[1]);
}
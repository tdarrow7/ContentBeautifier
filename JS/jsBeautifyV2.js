let downloadArray = [],
	errorArray = [];

	console.log('inside v2');

// run through the HTML and Reformat EVERYTHING
function reformatEverythingEverywhere(element) {

	let nodeElms = element.querySelectorAll('*'),
		h1Tags = element.querySelectorAll('h1');

	let allElms = Array.prototype.slice.call(nodeElms);
	allElms.push(element);
	
	// verify that only one h1 exists
	VerifySingleH1(h1Tags);

	// reformat legacy bold tags
	let bTags = Array.prototype.slice.call(element.querySelectorAll('b'));
	if (element.nodeName == "B")
		bTags.push(element);
	
	// reformat legacy italic tags
	let iTags = Array.prototype.slice.call(element.querySelectorAll('i'));
	if (element.nodeName == "I"){
		iTags.push(element);
	}
	swapElTypes(bTags, 'strong');
	swapElTypes(iTags, 'em');
	
	// remove all classes and styles for all elements
	removeAttribute(allElms, 'class');
	removeAttribute(allElms, 'style');
	removeAttribute(allElms, 'data-cbnode');
	removeAttribute(allElms, 'data-cbcopy');

	// recall all elements after doing modifications
	nodeElms = element.querySelectorAll('*');
	allElms = Array.prototype.slice.call(nodeElms);
	allElms.push(element);
	// check phone number formatting in text
	restructureTele(allElms);

	// recall all elements after checking for phone numbers
	nodeElms = element.querySelectorAll('*');
	allElms.push(nodeElms, element);

	// reformat items in list
	switchStatements(allElms, element);
}

// general function to swap legacy/incorrect elements with appropriate element equivalent
function swapElTypes(listofElms, nameOfElm) {
	for (let i = 0; i < listofElms.length; i++) {
		let replaceTag = document.createElement(nameOfElm);
		replaceTag.innerHTML = listofElms[i].innerHTML;
		listofElms[i].parentNode.replaceChild(replaceTag, listofElms[i]);
	}
}

function switchStatements(nodeList, element){
	for (let i = 0; i < nodeList.length; i++){
		// console.log("NodeList["+i+"]: ", nodeList[i]);
		// console.log("NodeList["+i+"].nodeName: ", nodeList[i].nodeName);
		// console.log("parentN["+i+"]: ", nodeList[i].parentNode);
	

		let nodeType = nodeList[i].nodeName;
		switch(nodeType)
		{
			case "SPAN": 
				let parentN2 = nodeList[i].parentNode;
				let parentN2Name = parentN2.nodeName,
					removeSpanIf = ["UL", "OL", "LI", "P"];
				if (removeSpanIf.indexOf(parentN2Name) > -1)
					nodeList[i].outerHTML = nodeList[i].innerHTML;
				break;
			case "P":
				let pNode = nodeList[i];
				for (let x = 0; x < pNode.children.length; x++){
					if (pNode.children[x].nodeName == "BR"){
						let newPTagList = pNode.innerHTML.split("<br>");
						newPTagList = newPTagList.map(createNewP);
						let nodesFragment = document.createDocumentFragment();
						for (let tag of newPTagList){
							nodesFragment.appendChild(tag);
						}

						let parentN3 = pNode.parentNode; 
						parentN3.replaceChild(nodesFragment, pNode);
						break;
					}
				}	
				break;
			case "IMG":
				let parentN4 = nodeList[i].parentNode;
				handleImageElement(nodeList[i]);
				break;
			case "A":
				handleLinkElement(nodeList[i]);
				break;
		}
		nodeList = element.querySelectorAll("*");
	}

	// 	//-------------WAS INITIALLY "removeExtraNodes" function-------------//

	// 	// remove HTML comments
	// 	nodeList[i].innerHTML = nodeList[i].innerHTML.replace(/<!--.*?-->/g, "");
	// 	// replace non-breaking spaces with spaces
	// 	nodeList[i].innerHTML = nodeList[i].innerHTML.replace(/&nbsp;/g, " ");
	// 	// get match list of words/numbers that are not spaces/carriage returns/tabs/new lines
	// 	let temp = nodeList[i].innerText.match(/[^\s\r\t\n]+/g);
		
	// 	// if no matches (no 'words') exist
	// 	if (temp === null || (temp.length == 1 && temp[0].length == 1)) {
	// 		nodeList[i].remove();
	// 	}

	// 	//-------------------------------------------------------------------//
		// download everything in downloadArray
		//downloadAllItems(0);
}

// creates '<p>' tag with innerHTML equal to 'string'
function createNewP(string) {
	let newP = document.createElement("p");
	newP.innerHTML = string.replace(/\u21B5/g, "");
	console.log("newP.innerHTML: ", newP.innerHTML);
	// return '<p>' + string + '</p>';
	return newP;
}

// checks/handles element to make sure there is only one H1 header
function VerifySingleH1(nodeArray) {
	let elArray = Array.prototype.slice.call(nodeArray);
	elArray.unshift();
	if (elArray.length > 0) 
		swapElTypes(elArray, 'h2');
}

// cycle through all items with classes and remove the classes
function removeAttribute(nodeArray, attrName) {
	let elmArray = Array.prototype.slice.call(nodeArray);
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

// restructure all text that can be phone numbers into phone number links
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
			console.log(downloadArray[i][0]);
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

function resetDownloadErrorArrays() {
	downloadArray = [];
	errorArray = [];
}
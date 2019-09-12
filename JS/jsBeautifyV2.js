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
	nodeElms = switchStatements(element, "children");
	// console.log("nodeElms before removeExtraJunk: ", nodeElms);
	removeExtraJunk(nodeElms, 0);
}

// general function to swap legacy/incorrect elements with appropriate element equivalent
function swapElTypes(listofElms, nameOfElm) {
	for (let i = 0; i < listofElms.length; i++) {
		let replaceTag = document.createElement(nameOfElm);
		replaceTag.innerHTML = listofElms[i].innerHTML;
		listofElms[i].parentNode.replaceChild(replaceTag, listofElms[i]);
	}
}

// goes through nodeList and reformats based on nodeName property
function switchStatements(element, which){
	let nodeList = null;
	console.log("Element: ", element);

	if (which === "children"){
		nodeList = element.getElementsByTagName("*");
	}
	if (which === "parent") {
		// element needs to be in a list, because 'element' is not a list and therefore doesn't have a length (needed to enter the for loop)
		nodeList = [element];
	}
	console.log("nodeListNow: ", nodeList);
	console.log("nodeListNow.type: ", typeof(nodeList));
	
	for (let i = 0; i < nodeList.length; i++){
		console.log("nodeList: ", nodeList);
		let nodeType = nodeList[i].nodeName;
		switch(nodeType)
		{
			case "UL":
				let pNodeUL = nodeList[i];
				for (let x = 0; x < pNodeUL.children.length; x++){
					if (pNodeUL.children[x].nodeName == "SPAN"){
						pNodeUL.children[x].remove();
					}
				}	
				break;
			case "OL":
				let pNodeOL = nodeList[i];
				for (let x = 0; x < pNodeOL.children.length; x++){
					if (pNodeOL.children[x].nodeName == "SPAN"){
						pNodeOL.children[x].remove();
					}
				}	
				break;
			case "LI":
				let pNodeLI = nodeList[i];
				for (let x = 0; x < pNodeLI.children.length; x++){
					if (pNodeLI.children[x].nodeName == "SPAN"){
						pNodeLI.children[x].remove();
					}
				}	
				break;
			case "P":
				let pNodeP = nodeList[i];
				for (let x = 0; x < pNodeP.children.length; x++){
					if (pNodeP.children[x].nodeName == "BR"){
						let newPTagList = pNodeP.innerHTML.split("<br>");
						newPTagList = newPTagList.map(createNewP);
						let nodesFragment = document.createDocumentFragment();
						for (let tag of newPTagList){
							nodesFragment.appendChild(tag);
						}

						let parentP = pNodeP.parentNode; 
						parentP.replaceChild(nodesFragment, pNodeP);
						break;
					}
					if (pNodeP.children[x].nodeName == "SPAN"){
						pNodeP.children[x].remove();
					}
				}	
				break;
			case "IMG":
				handleImageElement(nodeList[i]);
				break;
			case "A":
				handleLinkElement(nodeList[i]);
				break;
		}
	}

	// download everything in downloadArray
	downloadAllItems(0);
	if (which === "children"){
		switchStatements(element, "parent");
	}
	nodeList = element.getElementsByTagName("*");
	console.log("finalNodeList: ", nodeList);
	return nodeList;
}

function removeExtraJunk(allNodes, index){
	
	// console.log("allNodes BEFORE FUNCTION: ", allNodes);
	for (let i = index; i < allNodes.length; i++){
		// console.log("RemoveExtraJunk["+i+"]: ", allNodes[i]);
		// remove HTML comments
		allNodes[i].innerHTML = allNodes[i].innerHTML.replace(/<!--.*?-->/g, "");
		// replace non-breaking spaces with spaces
		allNodes[i].innerHTML = allNodes[i].innerHTML.replace(/&nbsp;/g, " ");
		// get match list of words/numbers that are not spaces/carriage returns/tabs/new lines
		let temp = allNodes[i].innerText.match(/[^\s\r\t\n]+/g);
		
		// console.log("TEMP["+i+"]: ", temp);
		// console.log("AFTER: RemoveExtraJunk["+i+"].innerHTML: ", allNodes[i].innerHTML);
		
		// if no matches (no 'words') exist
		if (temp === null || (temp.length == 1 && temp[0].length == 1)) {
			allNodes[i].remove();
			removeExtraJunk(allNodes, i);
			return;
		}
		// console.log("allNodes NEW: ", allNodes);
		
	}
	// console.log("allNodes AFTER FUNCTION: ", allNodes);
	
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
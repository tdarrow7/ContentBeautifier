let downloadArray = [],
	errorArray = [];

	console.log('inside v2');

// run through the HTML and Reformat EVERYTHING
function reformatEverythingEverywhere(element) {

	
	// let parentN = element.parentNode;
	
	let nodeElms = element.querySelectorAll('*'),
		h1Tags = element.querySelectorAll('h1');

	let allElms = Array.prototype.slice.call(nodeElms);
	allElms.push(element);

	// used to check if the nodeList has element with parentNodes
	/*for (let i = 0; i < allElms.length; i++){
        // console.log("OG Node[i]: ", og[i], "    What's the parentNode?: ", og[i].parentNode);
        console.log("Beginning of Function, All Elms "+ i + ": ", allElms[i], "    What's the parentNode?: ", allElms[i].parentNode);
	}*/

	// console.log("Before anything gets modified (nodeElms NodeList): ", nodeElms);
	// console.log("Before anything gets modified (allElms Array): ", allElms);
	
	VerifySingleH1(h1Tags);
	let bTags = Array.prototype.slice.call(element.querySelectorAll('b'));
	if (element.nodeName == "B"){
		bTags.push(element);
	}
	let iTags = Array.prototype.slice.call(element.querySelectorAll('i'));
	if (element.nodeName == "I"){
		iTags.push(element);
	}
	swapElTypes(bTags, 'strong');
	swapElTypes(iTags, 'em');
	
	// remove all classes and styles for all elements
	removeAttribute(allElms, 'class');
	removeAttribute(allElms, 'style');

	// recall all elements after doing modifications
	nodeElms = element.querySelectorAll('*');
	allElms = Array.prototype.slice.call(nodeElms);
	allElms.push(element);
	// check phone number formatting in text
	restructureTele(allElms);

	// used to check if the nodeList has element with parentNodes
	/*for (let i = 0; i < allElms.length; i++){
        // console.log("OG Node[i]: ", og[i], "    What's the parentNode?: ", og[i].parentNode);
        console.log("After Restructure Tele All Elms "+ i + ": ", allElms[i], "    What's the parentNode?: ", allElms[i].parentNode);
	}*/

	// recall all elements after checking for phone numbers
	nodeElms = element.querySelectorAll('*');
	// console.log("AllElms: ", nodeElms);
	allElms = Array.prototype.slice.call(nodeElms);
	allElms.push(element);

	// used to check if the nodeList has element with parentNodes
	/*for (let i = 0; i < allElms.length; i++){
        // console.log("OG Node[i]: ", og[i], "    What's the parentNode?: ", og[i].parentNode);
        console.log("Before SwitchStatement All Elms "+ i + ": ", allElms[i], "    What's the parentNode?: ", allElms[i].parentNode);
	}*/
	
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
	console.log("switchStatements nodeList: ", nodeList);

	// used to check if the nodeList has element with parentNodes
	// for (let i = 0; i < nodeList.length; i++){
    //     // console.log("OG Node[i]: ", og[i], "    What's the parentNode?: ", og[i].parentNode);
    //     console.log("Within switchStatements function before cases nodeList "+ i + ": ", nodeList[i], "    What's the parentNode?: ", nodeList[i].parentNode);
	// }
	
	// console.log("newRestructured element: ", nodeList[0]);
	// console.log("newRestructured element: ", recursiveRestructure(nodeList[0]));
	for (let i = 0; i < nodeList.length; i++){
		console.log("NodeList["+i+"]: ", nodeList[i]);
		console.log("NodeList["+i+"].nodeName: ", nodeList[i].nodeName);
		console.log("parentN["+i+"]: ", nodeList[i].parentNode);
	

		let nodeType = nodeList[i].nodeName;
		let parentN = nodeList[i].parentNode;

		switch(nodeType)
		{
			case "SPAN": 
				// console.log("is a span");
				// console.log("parentN: : ", parentN);
				let parentN2 = nodeList[i].parentNode;
				// console.log("parentN2: : ", parentN2);
				let parentN2Name = parentN2.nodeName,
					removeSpanIf = ["UL", "OL", "LI", "P"];
				// console.log("parentN2.nodeName : ", parentN2Name);
				// console.log("is parent found in list: ", removeSpanIf.indexOf(parentN2Name));
				
				if (removeSpanIf.indexOf(parentN2Name) > -1){
					nodeList[i].outerHTML = nodeList[i].innerHTML;
				}
				break;
			case "BR":
				// console.log("is a br");
				// console.log("parentN: : ", parentN);
				let parentN3 = nodeList[i].parentNode;
				// console.log("parentN3: : ", parentN3);
				let parentN3Name = parentN3.nodeName,
					reformatBrIf = ["P"];
				// console.log("parentN3.nodeName : ", parentN3Name);
	
				// console.log("is parent found in list: ", reformatBrIf.indexOf(parentN3Name));
				if (reformatBrIf.indexOf(parentN3Name) > -1){
					let newPTagList = parentN3.innerHTML.split("<br>");
					newPTagList = newPTagList.map(createNewP);
					
					let pTagsConcat = newPTagList.join();
					console.log('pTagsConcat:' + pTagsConcat);
					console.log('parentN3Name: ' + parentN3Name);
					parentN3.outerHTML = pTagsConcat;
				}
				break;
			case "IMG":
				// console.log("is an img");
				// console.log("parentN: : ", parentN);
				let parentN4 = nodeList[i].parentNode;
				// console.log("parentN4: : ", parentN4);
				let parentN4Name = parentN4.nodeName;
				// console.log("parentN4.nodeName : ", parentN4Name);
				handleImageElement(nodeList[i]);
				break;
			case "A":
				// console.log("is 'a' tag");
				// console.log("parentN: : ", parentN);
				let parentN5 = nodeList[i].parentNode;
				// console.log("parentN5: : ", parentN5);
				let parentN5Name = parentN5.nodeName;
				// console.log("parentN5.nodeName : ", parentN5Name);
				handleLinkElement(nodeList[i]);
				break;
		}
	
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
		downloadAllItems(0);
}
	


/*function recursiveRestructure(el){
	console.log("what is OG el: ",  el);
	let newEl = el.cloneNode(true);
	console.log("newEl: ", newEl);
	console.log("newEl.CHILDREN: ", newEl.attributes);
	for (let j = 0; j < newEl.children.length; j++){
		(newEl.children)[j].remove();
		console.log("Updated newEl ["+j+"]: ", newEl);

	}

	console.log("NEW newEl: ", newEl);

	let arrayofChildren = el.children;
	if (arrayofChildren.length > 0){
		for (let i = 0; i < arrayofChildren.length; i++){
			// newEl.innerHTML += recursiveRestructure(arrayofChildren[i]).outerHTML;
			console.log("RR: ", recursiveRestructure(arrayofChildren[i]));
		}
	}
	return newEl;
}
*/

// creates '<p>' tag with innerHTML equal to 'string'
function createNewP(string) {
	let newP = document.createElement("p");
	newP.innerHTML = string;
	// return '<p>' + string + '</p>';
	return newP.outerHTML;
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
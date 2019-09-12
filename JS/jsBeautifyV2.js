let downloadArray = [],
	errorArray = [];


// run through the HTML and Reformat EVERYTHING
function reformatEverythingEverywhere(element) {

	let nodeElms = element.querySelectorAll('*');

	let allElms = Array.prototype.slice.call(nodeElms);
	allElms.push(element);

	// remove all classes and styles for all elements
	removeMultipleAttributes(allElms, ['class', 'style', 'data-cbnode', 'data-cbcopy']);

	// verify that only one h1 exists
	VerifySingleH1(element.querySelectorAll('h1'));

	// reformat legacy tags
	reformatLegacyTags(element);

	// reformat items in list
	switchStatements(element, "children");
}

// general function to swap legacy/incorrect elements with appropriate element equivalent
function swapElTypes(listofElms, nameOfElm) {
	for (let i = 0; i < listofElms.length; i++) {
		let replaceTag = document.createElement(nameOfElm);
		replaceTag.innerHTML = listofElms[i].innerHTML;
		listofElms[i].parentNode.replaceChild(replaceTag, listofElms[i]);
	}
}

// reformat legacy tags
function reformatLegacyTags(element){
	// reformat legacy bold tags
	let bTags = Array.prototype.slice.call(element.querySelectorAll('b'));
	if (element.nodeName == "B")
		bTags.push(element);
	
	// reformat legacy italic tags
	let iTags = Array.prototype.slice.call(element.querySelectorAll('i'));
	if (element.nodeName == "I")
		iTags.push(element);
	
	// run element swap functions
	swapElTypes(bTags, 'strong');
	swapElTypes(iTags, 'em');
}

// goes through nodeList and reformats based on nodeName property
// Helper Functions: removeExtraJunk(node), restructureTele(node)
function switchStatements(element, which){
	let nodeList = null;

	if (which === "children")
		nodeList = element.getElementsByTagName("*");
	if (which === "parent")
		// element needs to be in a list, because 'element' is not a list and therefore doesn't have a length (needed to enter the for loop)
		nodeList = [element];
	
	for (let i = 0; i < nodeList.length; i++){

		// clean up innerHTML first before checking cases
		removeExtraJunk(nodeList[i]);
		restructureTele(nodeList[i]);

		let nodeType = nodeList[i].nodeName;
		switch(nodeType)
		{
			// if the UL node has a SPAN child, remove the SPAN child node
			case "UL":
				let pNodeUL = nodeList[i];
				for (let x = 0; x < pNodeUL.children.length; x++){
					if (pNodeUL.children[x].nodeName == "SPAN"){
						pNodeUL.children[x].remove();
					}
				}	
				break;
			// if the OL node has a SPAN child, remove the SPAN child node
			case "OL":
				let pNodeOL = nodeList[i];
				for (let x = 0; x < pNodeOL.children.length; x++){
					if (pNodeOL.children[x].nodeName == "SPAN"){
						pNodeOL.children[x].remove();
					}
				}	
				break;
			// if the LI node has a SPAN child, remove the SPAN child node
			case "LI":
				let pNodeLI = nodeList[i];
				for (let x = 0; x < pNodeLI.children.length; x++){
					if (pNodeLI.children[x].nodeName == "SPAN"){
						pNodeLI.children[x].remove();
					}
				}	
				break;
			// if the P node has a BR child, split the P innerHTMl by the <br> tags, 
			// and create/add new paragraph elements containing the split strings
			// else if the P node has a SPAN child, remove the SPAN child node
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
			// if an IMG node, try to download 'IMG' link
			case "IMG":
				handleImageElement(nodeList[i]);
				break;
			// if an A node, try to download 'A' link
			case "A":
				handleLinkElement(nodeList[i]);
				break;
		}
	}

	if (which === "children")
		// run function on parent node (node that was clicked on)
		switchStatements(element, "parent");
	// end of function
	return;
}

// removes HTML comments and replaces non-breaking spaces with spaces
function removeExtraJunk(node){
		// remove HTML comments
		node.innerHTML = node.innerHTML.replace(/<!--.*?-->/g, "");
		// replace non-breaking spaces with spaces
		node.innerHTML = node.innerHTML.replace(/&nbsp;/g, " ");
}

// creates '<p>' tag with innerHTML equal to 'string'
function createNewP(string) {
	let newP = document.createElement("p");
	newP.innerHTML = string.replace(/\u21B5/g, "");
	// return '<p>' + string + '</p>';
	return newP;
}

// checks/handles element to make sure there is only one H1 header
function VerifySingleH1(nodeArray) {
	
	let elArray = Array.prototype.slice.call(nodeArray);
	elArray.shift();
	if (elArray.length > 0) 
		swapElTypes(elArray, 'h2');
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
function restructureTele(node) {
		// searches for phone number with various formats
		if ((/\(?[[0-9]{3}[\.\-\)]{1}[0-9]{3}[\.\-]{1}[0-9]{4}/g).exec(node.innerHTML)) {
			// add node to teleNodeList if innerHTMl doesn't have "tel:" link in it
			if (node.outerHTML.search("tel:") == -1) {
				let updatedTeleLinkNodes = [];
				updatedTeleLinkNodes = node.innerHTML.match(/\(?[[0-9]{3}[\.\-\)]{1}[0-9]{3}[\.\-]{1}[0-9]{4}/g);
				for (let i = 0; i < updatedTeleLinkNodes.length; i++) {
					// create anchor/link tag
					let a = document.createElement("a");
					a.href = "tel:" + updatedTeleLinkNodes[i].replace(/[\.\(\)\-]/g, "");
					// populate anchor tag link area with new cleaned up number
					a.innerHTML = updatedTeleLinkNodes[i];
					// replace old node with newly made node with link
					node.innerHTML = node.innerHTML.replace(updatedTeleLinkNodes[i], a.outerHTML);
				}
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

function resetDownloadErrorArrays() {
	downloadArray = [];
	errorArray = [];
}
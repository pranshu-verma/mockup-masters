// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
	height: 200,
	width: 500,
});

enum layoutMode {
	HORIZONTAL = "HORIZONTAL",
	VERTICAL = "VERTICAL",
}

enum primaryAxisAlignItems {
	MIN = "MIN",
	MAX = "MAX",
	CENTER = "CENTER",
	SPACE_BETWEEN = "SPACE_BETWEEN",
}

enum counterAxisAlignItems {
	MIN = "MIN",
	MAX = "MAX",
	CENTER = "CENTER",
	BASELINE = "BASELINE"
}

enum layoutSizingHorizontal {
	FIXED = "FIXED",
	HUG = "HUG",
	FILL = "FILL"
}

enum layoutSizingVertical {
	FIXED = "FIXED",
	HUG = "HUG",
	FILL = "FILL"
}

enum Mock {
	PrintfulImage = "1:595",
	PrintfulPrinters = "1:21",
	Piece1 = "1:47",
	Rs320 = "1:51",
	BtnAddToCart = "1:165",
	BtnBuyNow = "2:35",
	IconCalendar = "1:373",
	DeliveryDate = "1:383",
	Description = "1:597",
}

figma.ui.onmessage = async (msg: { type: string, count: number }) => {
	const node = figma.currentPage.selection[0];
	console.log(node);

	const targetStrokeWeight = 1;
	const animationDuration = 1000;
	const animationSteps = 10;

	await process(300, 400, 113, 89, [Mock.PrintfulImage], layoutMode.HORIZONTAL, primaryAxisAlignItems.SPACE_BETWEEN, counterAxisAlignItems.CENTER, layoutSizingHorizontal.FIXED, layoutSizingVertical.FIXED, targetStrokeWeight, animationDuration, animationSteps);
	await process(317, 1110, 528, 80, [Mock.Description, Mock.DeliveryDate, Mock.IconCalendar, Mock.BtnBuyNow, Mock.BtnAddToCart, Mock.Rs320, Mock.Piece1, Mock.PrintfulPrinters], layoutMode.VERTICAL, primaryAxisAlignItems.SPACE_BETWEEN, counterAxisAlignItems.MIN, layoutSizingHorizontal.FIXED, layoutSizingVertical.FIXED, targetStrokeWeight, animationDuration, animationSteps);
	await process(36, 207, 528, 80, [Mock.PrintfulPrinters], layoutMode.HORIZONTAL, primaryAxisAlignItems.SPACE_BETWEEN, counterAxisAlignItems.CENTER, layoutSizingHorizontal.FIXED, layoutSizingVertical.FIXED, targetStrokeWeight, animationDuration, animationSteps);
	await process(24, 72, 528, 116, [Mock.Piece1], layoutMode.HORIZONTAL, primaryAxisAlignItems.SPACE_BETWEEN, counterAxisAlignItems.CENTER, layoutSizingHorizontal.FIXED, layoutSizingVertical.FIXED, targetStrokeWeight, animationDuration, animationSteps);
	await process(36, 57, 528, 158, [Mock.Rs320], layoutMode.HORIZONTAL, primaryAxisAlignItems.SPACE_BETWEEN, counterAxisAlignItems.CENTER, layoutSizingHorizontal.FIXED, layoutSizingVertical.FIXED, targetStrokeWeight, animationDuration, animationSteps);
	await process(32, 522, 528, 212, [Mock.BtnAddToCart, Mock.BtnBuyNow], layoutMode.HORIZONTAL, primaryAxisAlignItems.SPACE_BETWEEN, counterAxisAlignItems.CENTER, layoutSizingHorizontal.FIXED, layoutSizingVertical.FIXED, targetStrokeWeight, animationDuration, animationSteps);
	await process(20, 180, 528, 258, [Mock.IconCalendar, Mock.DeliveryDate], layoutMode.HORIZONTAL, primaryAxisAlignItems.SPACE_BETWEEN, counterAxisAlignItems.CENTER, layoutSizingHorizontal.FIXED, layoutSizingVertical.FIXED, targetStrokeWeight, animationDuration, animationSteps);
	await process(97, 1109, 528, 300, [Mock.Description], layoutMode.HORIZONTAL, primaryAxisAlignItems.SPACE_BETWEEN, counterAxisAlignItems.CENTER, layoutSizingHorizontal.FIXED, layoutSizingVertical.FIXED, targetStrokeWeight, animationDuration, animationSteps);

};

// Function to create a new Frame
async function createNewFrame(height, width, x, y, childrenNodeIds = []) {
	// Create a new frame
	const frame = figma.createFrame();
	frame.name = 'New Frame';
	frame.resize(width, height); // Set width and height of the frame

	// Add the frame in place
	const aChildNode = await figma.getNodeByIdAsync(childrenNodeIds[0]);
	aChildNode.parent.appendChild(frame);

	// Set the position of the frame on the canvas
	frame.x = x; // Set x-coordinate
	frame.y = y; // Set y-coordinate

	// Add children to the frame
	childrenNodeIds.forEach(async childNodeId => {
		const childNode = await figma.getNodeByIdAsync(childNodeId) as FrameNode | InstanceNode;
		frame.appendChild(childNode);
	});

	// Select the newly created frame
	figma.currentPage.selection = [frame];

	// Return the created frame
	return frame;
}

// This function animates the stroke weight of a frame node in Figma
async function animateFrameStrokeWeight(nodeId, targetWeight, duration, steps) {
	const node = await figma.getNodeByIdAsync(nodeId);

	if (node && node.type === "FRAME") {
		const initialWeight = node.strokeWeight as number;
		const weightIncrement = (targetWeight - initialWeight) / steps;
		let stepCount = 0;

		const interval = setInterval(() => {
			stepCount++;
			if (stepCount >= steps) {
				clearInterval(interval);
			}

			const currentWeight = initialWeight + weightIncrement * stepCount;
			setStrokeWeight(node, currentWeight);
		}, duration / steps);
	} else {
		console.error("Node not found or not a frame.");
	}
}

// Helper function to set stroke weight
function setStrokeWeight(node, weight) {
	const stroke = { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, visible: true, opacity: 1 };
	node.strokes = [stroke];
	node.strokeWeight = weight;
}

// Helper function to add autolayout to parent frame
async function addAutoLayoutToFrame(nodeId: string, layoutMode, primaryAxisAlignItems, counterAxisAlignItems, layoutSizingHorizontal, layoutSizingVertical) {
	const node = await figma.getNodeByIdAsync(nodeId);

	if (node && node.type === "FRAME") {
		node.layoutMode = layoutMode;
		node.primaryAxisAlignItems = primaryAxisAlignItems;
		node.counterAxisAlignItems = counterAxisAlignItems;
		node.layoutSizingHorizontal = layoutSizingHorizontal;
		node.layoutSizingVertical = layoutSizingVertical;
		node.paddingTop = 10;
		node.paddingBottom = 10;
		node.paddingLeft = 10;
		node.paddingRight = 10;
	}
}

const awaitTimeout = delay => new Promise(resolve => setTimeout(resolve, delay));

async function process(height: number, width: number, x: number, y: number, children: string[], 
	layoutMode: string, primaryAxisAlignItems: string, counterAxisAlignItems: string, 
	layoutSizingHorizontal: string, layoutSizingVertical: string, targetStrokeWeight: number, 
	animationDuration: number, animationSteps: number) {

	const frame = await createNewFrame(height, width, x, y, children);	
	await awaitTimeout(200);

	const frameNodeId = frame.id;
	animateFrameStrokeWeight(frameNodeId, targetStrokeWeight, animationDuration, animationSteps);
	await awaitTimeout(200);

	addAutoLayoutToFrame(frameNodeId, layoutMode, primaryAxisAlignItems, counterAxisAlignItems, layoutSizingHorizontal, layoutSizingVertical);
	await awaitTimeout(200);
}

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
	height: 200,
	width: 500,
});

figma.ui.onmessage = async (msg: { type: string, count: number }) => {
	console.log("hello");

  const targetStrokeWeight = 1;
	const animationDuration = 1000; 
	const animationSteps = 10; 

	const innerFrame = await createNewFrame(450, 150, 0, 0, ["1:117", "1:315"]);

  await awaitTimeout(300);

	const innerFrameNodeId = innerFrame.id; 
	animateFrameStrokeWeight(innerFrameNodeId, targetStrokeWeight, animationDuration, animationSteps);

  await awaitTimeout(1000);

  addAutoLayoutToFrame(innerFrameNodeId, "HORIZONTAL", "SPACE_BETWEEN", "CENTER");

  await awaitTimeout(300);

  const outerFrame = await createNewFrame(450, 300, 0, 0, [innerFrameNodeId, "1:317"]);

  await awaitTimeout(300);

	const outerFrameNodeId = outerFrame.id; 
	animateFrameStrokeWeight(outerFrameNodeId, targetStrokeWeight, animationDuration, animationSteps);

  await awaitTimeout(1000);

  addAutoLayoutToFrame(outerFrameNodeId, "VERTICAL", "SPACE_BETWEEN", "CENTER");
};

// Function to create a new Frame
async function createNewFrame(width, height, x, y, childrenNodeIds = []) {
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
  const stroke = { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, visible: true, opacity: 1};
  node.strokes = [stroke];
  node.strokeWeight = weight;
}

// Helper function to add autolayout to parent frame
async function addAutoLayoutToFrame(nodeId, layoutMode, primaryAxisAlignItems, counterAxisAlignItems) {
	const node = await figma.getNodeByIdAsync(nodeId);

	if (node && node.type === "FRAME") {
		node.layoutMode = layoutMode;
		node.primaryAxisAlignItems = primaryAxisAlignItems;
		node.counterAxisAlignItems = counterAxisAlignItems;
		node.layoutSizingHorizontal = "FIXED";
		node.layoutSizingVertical = "FIXED";
		node.paddingTop = 10;
		node.paddingBottom = 10;
		node.paddingLeft = 10;
		node.paddingRight = 10;
	}
}

const awaitTimeout = delay =>
  new Promise(resolve => setTimeout(resolve, delay));

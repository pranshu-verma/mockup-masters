// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
	height: 200,
	width: 500,
});

figma.ui.onmessage = (msg: { type: string, count: number }) => {
	const node = figma.currentPage.selection[0]; // Assuming you have the component selected

	const targetX = 300;
	const targetY = 150;

	let animationInterval = setInterval(() => {
		// Calculate how much to move in this frame
		const distanceX = targetX - node.x;
		const distanceY = targetY - node.y;
		const moveX = distanceX * 0.1; // Move 10% of remaining distance per frame
		const moveY = distanceY * 0.1;

		// Move the component
		node.x += moveX;
		node.y += moveY;

		// Stop animation when close enough to target
		if (Math.abs(distanceX) < 1 && Math.abs(distanceY) < 1) {
			clearInterval(animationInterval);
		}
	}, 10); // Update every 10 milliseconds (adjust for desired smoothness) 

	// figma.closePlugin();
};


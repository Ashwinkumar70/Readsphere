// @desc    Process a chat message
// @route   POST /api/ai/chat
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { message, bookId } = req.body;
    
    if (!message) {
      res.status(400);
      throw new Error('Message is required');
    }

    // Simulate AI Latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Dummy logic for a simulated AI response
    const aiResponse = `I'm your ReadSphere AI Assistant. You asked about "${message}" in the context of book ${bookId || 'this book'}. In a production environment, this endpoint would connect to an LLM like OpenAI to provide a real analytical answer based on the book's text!`;

    res.json({
      role: 'assistant',
      content: aiResponse
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process a quick action
// @route   POST /api/ai/action
// @access  Private
const executeAction = async (req, res, next) => {
  try {
    const { actionId, bookId } = req.body;

    if (!actionId) {
      res.status(400);
      throw new Error('Action ID is required');
    }

    // Simulate AI Latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const responses = {
      explain: "On this page, the author introduces key concepts that drive the narrative forward. This is a simulated backend response for the 'Explain' action.",
      summarize: "Here is a quick summary: The protagonist faces a major dilemma and learns important lessons. This is a simulated backend response for the 'Summarize' action.",
      story: "The story so far: We've followed the main characters through various challenges. This is a simulated backend response for the 'Story So Far' action.",
      listen: "Audio mode simulated. Imagine this text being spoken aloud to you. This is a simulated backend response for the 'Listen' action.",
    };

    const aiResponse = responses[actionId] || "Processing action...";

    res.json({
      role: 'assistant',
      content: aiResponse
    });
  } catch (error) {
    next(error);
  }
};

export { sendMessage, executeAction };

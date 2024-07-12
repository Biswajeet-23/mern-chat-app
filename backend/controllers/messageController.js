import { conversationModel } from "../model/conversationModel.js";
import { messageModel } from "../model/messageModel.js";

export const sendMsg = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.userId;
    const { message } = req.body;
    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new messageModel({ senderId, receiverId, message });
    conversation.messages.push(newMessage._id);
    await Promise.all([newMessage.save(), conversation.save()]);
    //socket.io functionalities here
    res.status(200).send({ message: "Msg sent" });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Something went Wrong", errorMsg: err.message });
  }
};

export const getMsg = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.userId;
    const conversation = await conversationModel
      .findOne(
        {
          participants: { $all: [senderId, receiverId] },
        },
        { messages: 1, _id: 0 }
      )
      .populate("messages");
    res.status(200).send({ messages: conversation.messages });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Somerthing is wrong", errorMessage: err.message });
  }
};

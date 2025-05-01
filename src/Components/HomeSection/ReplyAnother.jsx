 const totalRepliesCount = Array.isArray(post?.replies)
    ? post.replies.length
    : 0;

  // Handle reply submission (creation)
  const handleReplySubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/replies/${post.id}/replies`,
        {
          content: replyContent,
          userId: userId,
          userName: decodedToken?.name || decodedToken?.userName, // Assuming userName is available
          image: decodedToken?.image,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );

      const updatedPost = response.data;
      setPost(updatedPost);
      setAllReplies(updatedPost.replies); // <- Now replies should include correct userId
      setReplyContent("");
      setOpenReplyModal(false);
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  };

  // Fetch all replies for the post from backend
  const handleShowAllReplies = async () => {
    if (!showReplies) {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/replies/post/${post.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.data) {
          setAllReplies(response.data);
        }
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    }
    setShowReplies(!showReplies); // Toggle visibility
  };

  // EDIT REPLY FUNCTIONS

  const handleOpenEditModal = (reply) => {
    setReplyToEdit(reply);
    setEditContent(reply.content);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setReplyToEdit(null);
    setEditContent("");
  };

  const handleEditSubmit = async () => {
    try {
      // Prepare the updated reply object
      const updatedReply = {
        content: editContent,
        updatedAt: new Date().toISOString(), // Ensure you are sending the updated timestamp
      };

      // Send PUT request to the backend to update the reply
      const response = await axios.put(
        `http://localhost:8080/api/replies/${replyToEdit.id}`,
        updatedReply, // Send the updated content and timestamp
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        }
      );

      // Update the reply in allReplies state
      setAllReplies((prevReplies) =>
        prevReplies.map((r) =>
          r.id === replyToEdit.id ? { ...r, content: updatedReply.content } : r
        )
      );

      handleCloseEditModal(); // Close the edit modal
    } catch (error) {
      console.error("Error editing reply:", error);
    }
  };

  // DELETE REPLY FUNCTION
  const handleDeleteReply = async (replyId) => {
    console.log("Deleting reply with ID:", replyId); // Log the replyId
    try {
      await axios.delete(`http://localhost:8080/api/replies/${replyId}`);
      // Remove the deleted reply from state
      setAllReplies((prevReplies) =>
        prevReplies.filter((r) => r.id !== replyId)
      );
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };
import apiClient from "@/lib/apiClient";
import Post from "./Post";
import { ChangeEvent, useState } from "react";
import { PostType } from "@/types";

const Timeline = () => {

  const [postText, setPostText] = useState<string>("");
  const [latestPosts, setLatestPosts] = useState<PostType[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newPost = await apiClient.post("/posts/post", {
        content: postText,
      });
      setLatestPosts((prevPosts) => [newPost.data, ...prevPosts])
      setPostText("");
    } catch (error) {
      alert("ログインしていないまたは、投稿内容が空です。");
    }
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-4">
        <div className="bg-white shadow-md rounded p-4 mb-4">
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="What's on your mind?"
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPostText(e.target.value)}
              value={postText}
            ></textarea>
            <button
              type="submit"
              className="mt-2 bg-gray-700 hover:bg-green-700 duration-200 text-white font-semibold py-2 px-4 rounded"
            >
              投稿
            </button>
          </form>
        </div>
        {latestPosts.map((post: PostType) => (
          <Post key={post.id} />
        ))}
      </main>
    </div>
  );
};

export default Timeline;

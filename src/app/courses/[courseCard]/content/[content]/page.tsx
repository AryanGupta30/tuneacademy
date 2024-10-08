"use client";

import { useState } from "react";
import type { NextPage } from "next";
import CourseContent from "@/components/CourseContent";
import { databases, Query } from "@/lib/appwrite";
import { Video } from "@/interface/interface";
import { usePathname } from "next/navigation";

const Home: NextPage = () => {
  const pathname = usePathname();
  const content = pathname.split("/").pop() || "/";
  console.log(content);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const fetchVideo = async (level: string, number: number) => {
    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
        [
          Query.equal("title", content),
          Query.equal("level", level),
          Query.equal("number", number),
        ]
      );

      if (response && response.documents.length > 0) {
        const doc = response.documents[0];
        const video: Video = {
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          $updatedAt: doc.$updatedAt,
          $collectionId: doc.$collectionId,
          $databaseId: doc.$databaseId,
          $permissions: doc.$permissions,
          title: doc.title,
          level: doc.level,
          number: doc.number,
          url: doc.url,
        };
        console.log(video);
        setSelectedVideo(video);
      } else {
        setSelectedVideo(null);
      }
    } catch (error) {
      console.error("Failed to fetch video:", error);
      setSelectedVideo(null);
    }
  };

  console.log(selectedVideo?.url);

  return (
    <div className="min-h-screen bg-black py-12 pt-36 flex flex-col md:flex-row">
      <CourseContent onSelectVideo={fetchVideo} />
      <div className="flex flex-col flex-1 p-4">
        {selectedVideo ? (
          <div key={selectedVideo.$id} className="my-4">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-10">
              {content} - {selectedVideo.number}
            </h3>
            <div className="aspect-w-16 aspect-h-9 bg-green-50">
              <video controls className="w-full h-auto">
                <source src={selectedVideo.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          <h1 className="mt-20 md:mt-0 text-2xl md:text-5xl font-bold text-transparent text-slate-400">
            Choose Video to Begin
          </h1>
        )}
      </div>
    </div>
  );
};

export default Home;

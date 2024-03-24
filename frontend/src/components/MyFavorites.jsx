import React, { useState, useEffect } from "react";
import "../css/myFavorite.css";
import axios from "axios";

function MyFavorites({ userId }) {
  console.log(userId, typeof userId);
  //{categoryName: "咖啡廳", isPrivate: 0, postId: 23, images: ["/9j/4RosRXhpZgAATU0AKgAAAAgADAEAAAMAAAABArwAAAEBAA…KYpSkIdTLqyn+XX5xrqcu2zaOl6OjzOj8s5r1tSuXq6sf/9k=", "/9j/4SO3RXhpZgAATU0AKgAAAAgADAEAAAMAAAABAr
  const [categories, setCategories] = useState([]);
  const [showAll, setShowAll] = React.useState(
    Array(categories.length).fill(false)
  );

  useEffect(() => {
    setShowAll(Array(categories.length).fill(false));
  }, [categories]);

  const toggleShowAll = (index) => {
    const newShowAll = [...showAll];
    newShowAll[index] = !newShowAll[index];
    setShowAll(newShowAll);
  };

  useEffect(() => {
    const Uid = localStorage.getItem("Uid") || "10";
    const fetchList = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/member/savinglist/${Uid}`
        );
        let groupedData = groupByCategoryName(response.data);
        setCategories(groupedData);
        console.log(response.data);
        console.log(groupedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchList();
  }, []);

  const deletePost = async (postId) => {
    console.log(postId);
    const Uid = localStorage.getItem("Uid") || "10";
    try {
      await axios.delete(`http://localhost:8000/member/savinglist/deletePost`, {
        data: {
          uid: Uid,
          postid: postId,
        },
      });

      // 重置categories
      setCategories((currentCategories) =>
        currentCategories.map((category) => ({
          ...category,
          posts: category.posts.filter((post) => post.postId !== postId),
        }))
      );

      alert("收藏已更改");
    } catch (error) {
      console.error("error happens:", error);
      alert("toggle failed");
    }
  };

  const togglePrivate = async (categoryId) => {
    console.log(categoryId);
    const Uid = localStorage.getItem("Uid") || "10";
    try {
      await axios.put(`http://localhost:8000/member/savinglist/togglePrivate`, {
        uid: Uid,
        categoryId: categoryId,
      });

      // 刪除後，重置categories
      setCategories((currentCategories) =>
        currentCategories.map((category) => {
          if (category.categoryId === categoryId) {
            return {
              ...category,
              isPrivate: !category.isPrivate,
            };
          }
          return category;
        })
      );

      alert("收藏已删除");
    } catch (error) {
      console.error("删除收藏时发生错误:", error);
      alert("删除收藏失败");
    }
  };

  function groupByCategoryName(data) {
    return data.reduce((accumulator, currentItem) => {
      const existingCategory = accumulator.find(
        (item) => item.categoryName === currentItem.categoryName
      );
      if (existingCategory) {
        existingCategory.posts.push(currentItem);
      } else {
        accumulator.push({
          categoryName: currentItem.categoryName,
          categoryId: currentItem.categoryId,
          isPrivate: currentItem.isPrivate,
          posts: [currentItem],
        });
      }
      return accumulator;
    }, []);
  }
  console.log("Render userId:", userId, "Type:", typeof userId);

  // 根据userId条件渲染的测试
  console.log(
    Number(userId) === 10,
    "<-- should be true if userId is 10 and a number"
  );
  //0 {categoryName: "咖啡廳", isPrivate: 0, PostIds: "8,6,5,8,9", Images: Object}
  //{categoryName: "咖啡廳", isPrivate: 0, posts: Array}
  //{categoryName: "未分類", isPrivate: 0, posts: Array}
  //{categoryName: "咖啡廳", isPrivate: 0, postId: 23, images: ["/9j/4RosRXhpZgAATU0AKgAAAAgADAEAAAMAAAABArwAAAEBAA…KYpSkIdTLqyn+XX5xrqcu2zaOl6OjzOj8s5r1tSuXq6sf/9k=", "/9j/4SO3RXhpZgAATU0AKgAAAAgADAEAAAMAAAABAr
  const visibleCategories =
    Number(userId) === 10
      ? categories
      : categories.filter((category) => category.isPrivate === 0);

  console.log(visibleCategories);
  console.log("Render userId:", userId, "Type:", typeof userId);

  // 根据userId条件渲染的测试
  console.log(
    Number(userId) === 10,
    "<-- should be true if userId is 10 and a number"
  );
  return (
    <div style={{ width: "1240px" }}>
      {visibleCategories.map((category, index) => (
        <div key={index} style={{ marginBottom: "50px" }}>
          <div className="d-flex align-items-center">
            <div className="name-box">
              <span className="categoryName" style={{ fontSize: "25px" }}>
                {category.categoryName}
              </span>
            </div>

            {Number(userId) === 10 && (
              <div
                style={{ padding: "5px", cursor: "pointer" }}
                onClick={() => togglePrivate(category.categoryId)}
              >
                {category.isPrivate ? (
                  <i className="fa-solid fa-lock"></i>
                ) : (
                  <i className="fa-solid fa-unlock"></i>
                )}
              </div>
            )}

            <div>{category.posts.length}</div>
          </div>
          <div className="gallery-row">
            {category.posts
              .slice(0, showAll[index] ? category.posts.length : 5)
              .map((post, postIndex) => (
                <div className="gallery-item" key={postIndex}>
                  <div className="img-box">
                    <img
                      src={`data:image/jpeg;base64,${post.images[0]}`}
                      alt="Post"
                    />
                  </div>
                  <div className="caption">
                    <div className="title">{post.title}</div>
                    {Number(userId) === 10 && (
                      <div
                        className="save-icon"
                        onClick={() => deletePost(post.postId)}
                      >
                        <i className="bi bi-bookmark-fill"></i>
                      </div>
                    )}
                  </div>
                  <div className="account">{post.account}</div>
                </div>
              ))}
          </div>

          {category.posts.length > 5 && (
            <div className="downarrow" onClick={() => toggleShowAll(index)}>
              <i
                className={`bi bi-arrow-down-circle-fill ${
                  showAll[index] ? "rotate-180" : ""
                }`}
              ></i>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* function PhotoGallery({ photos }) {
  const [showAll, setShowAll] = React.useState(false);
  const toggleShowAll = () => setShowAll(!showAll);
  const photoItems = Array.isArray(photos) ? photos : [];
  return (
    
  );
}
 */
export default MyFavorites;

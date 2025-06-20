const api = "https://jsonplaceholder.typicode.com";

async function fetchAPI(url) {
    const response = await fetch(`${api}/${url}`);
    return response.json();
}

const main = async () => {
    const [userData, postData, commentData] = await Promise.all([
        fetchAPI("users"),
        fetchAPI("posts"),
        fetchAPI("comments"),
    ]);
    // 3
    const usersWithPosts = userData.map((user) => {
        const userPosts = postData.filter((post) => post.userId === user.id);
        return {
            ...user,
            posts: userPosts.map((post) => {
                return {
                    id: post.id,
                    title: post.title,
                    body: post.body,
                };
            }),
        };
    });
    const users = usersWithPosts.map((user) => {
        const userComments = commentData.filter((comment) =>
            user.posts.some((post) => post.id === comment.postId)
        );
        return {
            ...user,
            comments: userComments.map((comment) => {
                return {
                    id: comment.id,
                    postId: comment.postId,
                    name: comment.name,
                    body: comment.body,
                };
            }),
        };
    });
    //4
    const users3Comments = users.filter((user) => user.comments.length > 3);
    //5
    const usersFormatted = users3Comments.map((user) => {
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            postsCount: user.posts.length,
            commentsCount: user.comments.length,
        };
    });
    //6
    const userMostPosts = usersFormatted.reduce((max, user) => {
        return user.postsCount > max.postsCount ? user : max;
    }, usersFormatted[0]);
    //7
    const userSortedByPostsDesc = [...usersFormatted].sort(
        (a, b) => b.postsCount - a.postsCount
    );
    //8
    const [post1, comments1] = await Promise.all([
        fetchAPI("posts/1"),
        fetchAPI("comments?postId=1"),
    ]);
    const post1WithComments = {
        ...post1,
        comments: comments1,
    };
    console.log(post1WithComments);
};
main();

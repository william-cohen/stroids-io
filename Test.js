//This works!
/*global someFunction*/
//posts[0] = someFunction();


const posts = [
    {id: 1, upVotes: 2},
    {id: 2, upVotes: 18},
    {id: 3, upVotes: 1},
    {id: 4, upVotes: 30},
    {id: 5, upVotes: 50}
];

function getPostsWithManyUpvotes(posts_array) {
    let array = [];
    for (let i = 0; i < posts_array.length; i++) {
        if (posts_array[i].upVotes > 10) array.push(posts_array[i]);
    }
    return array;
}

let obj = {
    array: getPostsWithManyUpvotes(posts),
    text: 'Hello! :D'
};

console.log(obj);

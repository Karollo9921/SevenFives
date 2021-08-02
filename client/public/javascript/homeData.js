// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// const divForData = document.querySelector(".home-data");

// const getData = () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const res = await axios.get('http://localhost:3000/')
//             const data = res.data
//             console.log(data);
//             resolve(data);
//         } catch (error) {
//             reject(error)
//         }
//     })
    
// };

// // async function getData() {
// //     try {
// //       const response = await axios.get('http://localhost:3000/');
// //          console.log(response); 
// //     } catch (error) {
// //         console.error(error);
// //     }
// // };


// getData()


fetch("http://localhost:3000/")
    .then(res => res.json())
    .then(data => console.log(data));



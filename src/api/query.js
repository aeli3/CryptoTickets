import axios from "axios";
  
// Search Bar logic
export const handleSearch = (value) => {
    const endpoint = 'http://localhost:3000/api/event';
    axios.get(endpoint, {
    params: {
        q:value
    }
    })
    .then((res) => {
    let titles = res.data.map((e) => e.title)
    console.log(titles)
    })
    .catch((err) => console.log(err))
}
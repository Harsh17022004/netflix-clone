//  Consts 

const apiKeY = "3db9c30ad30570afb5ebead20b6fb4b6";
const apiRequest = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPath = {
    fetchAllCatergories : `${apiRequest}/movie/550?api_key=${apiKeY}`,
    fetchMoviesList : (id) => `${apiRequest}/discover/movie?api_key=${apiKeY}&with_genres=${id}`,
    fetchTrending : `${apiRequest}/movie/popular?api_key=${apiKeY}&language=en-US&page=1`,
    fetchPlaying : `${apiRequest}/movie/now_playing?api_key=${apiKeY}&language=en-US&page=1`,
    searchONYoutube :(query) =>  `https://www.googleapis.com/youtube/v3/search?part=snippet=&q${query}&key=AIzaSyBDA9McKnyqbiPP2pPwtaFuRKXx_Ibo5xg`
}



// Main app loader
function init(){
    builtMovieSelection(apiPath.fetchPlaying ,'Recent Played');
    fetchTrendingMovies();
    fetchAndBuildAllSection();
}

function fetchTrendingMovies(){
    builtMovieSelection(apiPath.fetchTrending ,'Trending Now')
    .then(list => {
        const randomIndex = parseInt(Math.random() * list.length );
        builtBannerSection(list[randomIndex]);
    }).catch(err =>{
        console.error(err);
    });

}


function builtBannerSection(movie){
    const bannerCont = document.getElementById('banner-section');

    bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;

    const div = document.createElement('div');

    div.innerHTML = `
            <h2 class="banner_tittle">${movie.title}</h2>
            <p class="banner_info"># ${movie.vote_average} in Tv shows</p>
            <p class="banner_review">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+"...":movie.overview}</p>
            <div class="action-btn-cont">
                <button class="action-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg> &nbsp;&nbsp; play</button>
                <button class="action-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg>&nbsp;&nbsp;More Info</button>
            </div>
    `;
    div.className = "banner-content";
    bannerCont.append(div);
}

function fetchAndBuildAllSection(){
    fetch(apiPath.fetchAllCatergories)
    .then(res => res.json())
    .then(res => {
        const Category = res.genres;
        if (Array.isArray(Category) && Category.length) {
            Category.forEach(Category =>{
                builtMovieSelection(apiPath.fetchMoviesList(Category.id),Category.name)
            })
        }
        console.table(Category);
    })
    .catch(err=>console.log(err));
}

function builtMovieSelection(fetchURL ,CategoryName){
   console.log(fetchURL,CategoryName);
   return fetch(fetchURL)
   .then(res=> res.json())
   .then(res=>{
    // console.table(res.results);
    const movies = res.results;
    if (Array.isArray(movies)&& movies.length) {
        builtMoviesCategorySection(movies.slice(0,5),CategoryName)
    }
    return movies;
})
   .catch(err=>console.log(err))
}

function builtMoviesCategorySection(list, CategoryName){
    console.log(list, CategoryName);

    const moviesCont = document.getElementById('movies-cont')

    const moviesListHTML = list.map(item=>{
        return `
        <img class="movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}" onclick="searchMovieTrailer('${item.title}')">

        `;
    }).join('');

    const movieSection = `
            <h2 class="movies-heading">${CategoryName}<span class="explore-nudge">Explore All</span> </h2>
            <div class="movie-row">
                ${moviesListHTML}    
            </div>
    `;

    console.log(movieSection);

    const div = document.createElement('div');
    div.className = 'movies-section';
    div.innerHTML = movieSection;

    // append html into movies section
    moviesCont.append(div);
}


function searchMovieTrailer(movieName){
    if(!movieName) return;

    fetch(apiPath.searchONYoutube(movieName))
    .then(res=>res.json)
    .then(res=>{
        console.log(res.item[0]);
    })
    .catch(err=>console.log(err));
}

window.addEventListener("load" , function(){
    init();
    window.addEventListener('scroll' ,function(){
        //header ui update
        const header = document.getElementById('header');
        if (window.scrollY > 5) {
            header.classList.add('black_bg');
        }
        else
            header.classList.remove('black_bg')
    })
});
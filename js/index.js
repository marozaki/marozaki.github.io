Alert("Welcome");

const btnSearch = document.querySelector("#btn-search");
btnSearch.addEventListener("click", async function () {
  const keyword = document.querySelector(".input-search").value;
  addUI(await getDataMovies("s", keyword));
  //console.log(keyword);
});

document.addEventListener("click", async function (el) {
  //apakah di dalam elemen target terdapat class btn-details?
  // if (el.target.classList.contains("btn-details")) {
  //   let imdbid = el.target.dataset.imdbid;
  //   console.log(imdbid);
  //   addUI(await getDataMovies( "i", imdbid))
  // }

  //apakah di dalam elemen target terdapat atribut data-imdbid?
  let targetEl = el.target.dataset;
  for (let imdbid in targetEl) {
    if (imdbid === "imdbid") {
      addUI(await getDataMovies("i", targetEl.imdbid));
    }
  }
});

function getDataMovies(key, value) {
  return fetch(`https://www.omdbapi.com/?apikey=b6596142&${key}=${value}`)
    .then((resolve) => {
      if (!resolve) {
        throw new Error("url salah!");
      }
      return resolve.json();
    })
    .then((resolve) => {
      if (resolve.status === "False") {
        throw new Error(resolve.statusText);
      }
      return key === "s" ? resolve.Search : resolve;
    });
}

function addUI(data) {
  if (Array.isArray(data)) {
    let cardMovies = "";
    data.forEach((m) => (cardMovies += elementCard(m)));
    document.querySelector(".body-content").innerHTML = cardMovies;
  } else {
    console.log();
    document.querySelector(".modal-dialog").innerHTML = elementDetails(data);
  }
}

function elementDetails(data) {
  return `<div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">${data.Title}(${data.Year})</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" >
            <div class="row">
              <div class="col text-center">
                <img src="${data.Poster} class="rounded mx-auto d-block" />
                <h1 class="mt-2">${data.Title}</h1>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <ul class="list-group list-groupflush">
                  <li class="list-group-item"><p>IMDB Rating : ${
                    data.imdbRating
                  }</p></li>
                  ${(function () {
                    let el = ``;
                    for (let key in data) {
                      if (key === "Title" || key === "Rated") continue;
                      el += `<li class="list-group-item"><p>${key} : ${data[key]}</p></li>`;
                      if (key === "Country") break;
                    }
                    return el;
                  })()}
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>`;
}

function elementCard(dataMovie) {
  return `<div class="col-md-4">
          <div class="card">
            <img src="${dataMovie.Poster}" class="card-img-top"/>
            <div class="card-body">
              <h5 class="card-title">${dataMovie.Title}</h5>
              <h6 class="card-title">Rilis ${dataMovie.Year}</h6>
              <button
                type="button"
                class="btn btn-primary btn-details"
                data-imdbid="${dataMovie.imdbID}"
                data-bs-toggle="modal"
                data-bs-target="#details-modal"
              >
                Details
              </button>
            </div>
          </div>
        </div>`;
}

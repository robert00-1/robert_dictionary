const resultDiv = document.getElementById("results");
const favoritesList = document.getElementById("favorites");

function searchWord() {
    const word = document.getElementById("wordInput").value.trim();
    if (!word) return;

    resultDiv.innerHTML = "<p>Loading...</p>";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => {
        if (!res.ok) {
            throw new Error("Word not found");
        }
        return res.json();
    })

    
    .then(data => displayWord(data[0]))
    .catch(() => {
        resultDiv.innerHTML = "<p>Word not found</p>"
    });
}
function displayWord(data) {
    if (!data || !data.meanings) {
        resultDiv.innerHTML = "<p>No definitions available</p>";
        return;
    }
    const phonetic = data.phonetic || "";
    const audio = data.phonetics?.find(p => p.audio)?.audio;
    const sources = data.sourceUrls || [];

    let definitionsHTML = "";
    data.meanings.forEach(meaning => {
        let synonyms = [...(meaning.synonyms ||[])];
        definitionsHTML += `<h3>${meaning.partOfSpeech}</h3><ul>`;
         
        meaning.definitions.forEach(def => {
            definitionsHTML += `<li>
            <p>${def.definition}</p>
            </li>`;
            if (def.synonyms && def.synonyms.length > 0) {
                synonyms.push(...def.synonyms);
            }

        }); 

        definitionsHTML += `</ul>`;

        synonyms = [...new Set(synonyms)];
        definitionsHTML += `
        <p><strong>Synonyms:</strong>
        ${synonyms.length ? synonyms.join(",") : "No synonyms available"}
        </p>
        `;
    });
    resultDiv.innerHTML = `
    <h2>${data.word}</h2>
    <p><strong>Pronunciation:</strong> ${phonetic}</p>
    ${audio ? `<audio controls src="${audio}"></audio>`: ""}
     <h3>Definitions</h3>
     ${definitionsHTML}
    
    ${
        sources.length
        ? `<p><strong>Sources:</strong>
        <a href="${sources[0]}" target="_blank">
        ${sources[0]}
        </a>
        </p>`
        :""
    }
        <button onclick="saveFavorite('${data.word}')"> save favorite</button>
      `;
    }
      function saveFavorite(word) {
      let favorite = JSON.parse(localStorage.getItem("favorites")) || [];
      if (!favorite.includes(word)) {
      favorite.push(word);
      localStorage.setItem("favorites", JSON.stringify(favorite));
       loadFavorites();
      }
      }

    function loadFavorites() {
    favoritesList.innerHTML = "";
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;
        favoritesList.appendChild(li);
        });
    }
        loadFavorites();

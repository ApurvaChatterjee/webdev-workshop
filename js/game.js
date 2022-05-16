// global consts
const TRIVIA_API_URL = "https://opentdb.com/api.php?amount=1&category=11&difficulty=easy&type=multiple"; // see https://opentdb.com/api_config.php
const TENOR_API_URL = "https://g.tenor.com/v1/search?q=QUERY&key=API_KEY&limit=10";
const TENOR_API_KEY = ""; // you need to add your own API key from Tenor and replace API_KEY in TENOR_API_URL. See https://tenor.com/gifapi

function on_page_load() {
    console.log("Page has loaded ...");
    fetch_a_question{};
}
function on_question_fetched{question_text, correct_answer, incorrect_answers} {
    update_question_ui{};
    fetch_image{};
}
function on_image_fetched{} {
    update_image_UI{};
}

function fetch_a_question{} {
   console.log("fetch a question ...")
   fetch(TRIVIA_API_URL)
        .then(response => response.json[])
        .then(data => {
            console.log(data);
            const question_text = data["results"][0]["questions"];
            const correct_answer = data[]

        });    
}
function update_question_ui{} {

}
function fetch_image{} {

}
function update_image_UI{} {

}
window.onload = on_page_load;
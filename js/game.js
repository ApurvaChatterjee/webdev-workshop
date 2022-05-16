const TRIVIA_API_URL = "https://opentdb.com/api.php?amount=1&category=11&difficulty=easy&type=multiple"; // see https://opentdb.com/api_config.php
const TENOR_API_KEY = "OYI9027EG189"; // you need to replace this with your own API key from Tenor (see https://tenor.com/gifapi)
const TENOR_API_URL = "https://g.tenor.com/v1/search?q=QUERY&key=API_KEY&limit=10".replace("API_KEY", TENOR_API_KEY);

let correct_answer = ""; // the current correct answer
let level = 1; // the current level
let lives = 3; // the number of lives remaining

function on_page_load() {
    register_answer_button_clicks();
    fetch_new_question();
}

function on_question_load(question, answer_options, answer) {
    update_question_text(question);
    update_answer_buttons_text(answer_options);
    store_correct_answer(answer);
    fetch_clue_image_gif(answer);
}

function on_clue_image_gif_load(gif_url) {
    update_clue_image(gif_url);
}

function on_answer_button_click(clicked_button) {
    check_answer(clicked_button, on_correct_answer, on_wrong_answer);
}

function on_correct_answer(clicked_button) {
    highlight_answer_button(clicked_button, "answer_button_correct");
    after_n_seconds(function() {
        increment_level();
        update_level_heading();
        fetch_new_question();
    }, 1);
}

function on_wrong_answer(clicked_button) {
    decrement_lives();
    update_hearts();
    highlight_answer_button(clicked_button, "answer_button_wrong");
    after_n_seconds(function() {
        check_lives(on_game_over, fetch_new_question);
    }, 1);
}

function on_game_over() {
    update_question_text("GAME OVER!");
    fetch_clue_image_gif("game over");
    hide_answer_buttons();
    after_n_seconds(go_to_homepage, 3);
}

// Event functions
function register_answer_button_clicks() {
    let answer_buttons = document.getElementsByClassName("answer_button");
    for (let i = 0; i < answer_buttons.length; ++i) {
        answer_buttons[i].addEventListener("click", function(event) {
            on_answer_button_click(event.currentTarget);
        });
    }
}

function fetch_new_question() {
    fetch(TRIVIA_API_URL)
        .then(response => response.json())
        .then(data => {
            question = data["results"][0]["question"];
            answer = data["results"][0]["correct_answer"];
            answer_options = data["results"][0]["incorrect_answers"];
            answer_insert_index = Math.floor(Math.random() * 4);
            answer_options.splice(answer_insert_index, 0, answer); // to insert the answer into the answer options
            on_question_load(question, answer_options, answer);
        });
}

function update_question_text(question) {
    document.getElementById("question_text").innerHTML = question;
}

function update_answer_buttons_text(answer_options) {
    let answer_buttons = document.getElementsByClassName("answer_button");
    for (let i = 0; i < answer_buttons.length; ++i) {
        answer_buttons[i].innerHTML = answer_options[i];
    }
}

function store_correct_answer(answer) {
    correct_answer = answer;
}

function fetch_clue_image_gif(answer) {
    fetch(TENOR_API_URL.replace("QUERY", answer))
        .then(response => response.json())
        .then(data => {
            const results_length = data["results"].length;
            const random_index = Math.floor(Math.random() * results_length);
            const media = data["results"][random_index]["media"][0];
            on_clue_image_gif_load(media["nanogif"]["url"]);
        });       
}

function update_clue_image(gif_url) {
    document.getElementById("question_clue_image").setAttribute("src", gif_url);
}

function check_answer(clicked_button, on_correct_answer, on_wrong_answer) {
    if (clicked_button.innerHTML === correct_answer) {
        on_correct_answer(clicked_button);
    } else {
        on_wrong_answer(clicked_button);
    }
}

function highlight_answer_button(clicked_button, highlight_class) {
    clicked_button.classList.add(highlight_class);
    setTimeout(function() {
        clicked_button.classList.remove(highlight_class);
    }, 1000);
}

function after_n_seconds(function_to_execute, n) {
    setTimeout(function_to_execute, n * 1000);
}

function increment_level() {
    level = level + 1;
}

function update_level_heading() {
    document.getElementById("level_heading").textContent = "Level " + level;
}

function decrement_lives() {
    lives = lives - 1;
}

function update_hearts() {
    let hearts = document.getElementsByClassName("ri-heart-3-fill");
    hearts[hearts.length-1].className = "ri-heart-3-line";
}

function check_lives(on_game_over, fetch_new_question) {
    if (lives === 0) {
        on_game_over();
    } else {
        fetch_new_question();
    }
}

function hide_answer_buttons() {
    let answer_buttons = document.getElementsByClassName("answer_button");
    for (let i = 0; i < answer_buttons.length; ++i) {
        answer_buttons[i].style.visibility = 'hidden';
    }
}

function go_to_homepage() {
    window.location.href = "index.html";
}

window.onload = on_page_load;
import $ from "jquery";

export const fetchHighScores = () => {
  return $.ajax({
    url: "https://assemble-77fd0.firebaseio.com/",
    method: "GET"
  });
};

export const addHighScore = (name, score) => {
  return $.ajax({
    method: "POST",
    url: "https://assemble-77fd0.firebaseio.com/",
    data: JSON.stringify({
      "name": `${name}`,
      "score": score
    })
  });
};

// setup for high scores
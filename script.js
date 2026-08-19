  const button = document.getElementById("changeButton");
  const message = document.getElementById("message");
  const heading = document.getElementById("heading");
  const title = document.getElementById("topLine");
  let clickCount=1;

  button.addEventListener("click", () => {
    if(clickCount===1)
    message.textContent="I have changed the DOM!";
    else if(clickCount===2)
    heading.textContent="Heading changed!";
    else if(clickCount===3)
    title.textContent="my webpage name changed"
    
    clickCount++;
  });
// shit version of components

// question block stuff

function createQuestionBlock(question_number) {
    var question_block = document.createElement("div");
    question_block.className = "question_block";
    
    var h6 = document.createElement("h6");
    h6.innerHTML = "Question " + question_number;
    question_block.appendChild(h6);
  
    var row1 = document.createElement("div");
    row1.className = "row";
    question_block.appendChild(row1);
  
    var col1 = document.createElement("div");
    col1.className = "col s2";
    row1.appendChild(col1);
  
    var input_field = document.createElement("div");
    input_field.className = "input-field col s8";
    row1.appendChild(input_field);
  
    var textarea = document.createElement("textarea");
    textarea.id = "question-" + question_number + "-text";
    textarea.className = "materialize-textarea";
    input_field.appendChild(textarea);
  
    var label = document.createElement("label");
    label.setAttribute("for", "question-" + question_number + "-text");
    label.innerHTML = "Find out:";
    input_field.appendChild(label);
  
    var col2 = document.createElement("div");
    col2.className = "col s2";
    row1.appendChild(col2);
  
    var row2 = document.createElement("div");
    row2.className = "row";
    question_block.appendChild(row2);
  
    var col3 = document.createElement("div");
    col3.className = "col s2";
    row2.appendChild(col3);
  
    var col4 = document.createElement("div");
    col4.className = "col s4";
    row2.appendChild(col4);
  
    var p = document.createElement("p");
    p.style = "padding: 3%;text-align:right";
    p.innerHTML = "Maximum follow up questions:";
    col4.appendChild(p);
  
    var col5 = document.createElement("div");
    col5.className = "input-field col s4";
    row2.appendChild(col5);
  
    var select = document.createElement("select");
    select.className = "browser-default";
    select.id = "question-" + question_number + "-n_followups";
    col5.appendChild(select);
  
    for (var i = 1; i <= 6; i++) {
      var option = document.createElement("option");
      option.value = i;
      option.innerHTML = i;
      select.appendChild(option);
    }
  
    var col6 = document.createElement("div");
    col6.className = "col s2";
    row2.appendChild(col6);
  
    return question_block;
}
  
function addQuestionBlock() {
    let question_number = document.getElementsByClassName("question_block").length + 1;
    let question_block = createQuestionBlock(question_number);
    document.getElementById("questions").appendChild(question_block);
}

function removeQuestionBlock() {
    let question_blocks = document.getElementsByClassName("question_block");
    if (question_blocks.length > 1) {
        document.getElementById("questions").removeChild(question_blocks[question_blocks.length - 1]);
    }
}

function loadQuestionnaire(questionnaire){
    // topic first
    topic.value = questionnaire.topic
    // context
    context.value = questionnaire.context
    // remove all question blocks
    let questions_div = document.getElementById("questions")
    questions_div.innerHTML = ""
    // loop through questions
    for(let i=0;i<questionnaire.questions.length;i++){
        question_number = i+1
        let question_block = createQuestionBlock(question_number);
        document.getElementById("questions").appendChild(question_block);

        document.getElementById(`question-${question_number}-text`).value = questionnaire.questions[i].question_text
        if(questionnaire.questions[i].n_follow_ups > 0 & questionnaire.questions[i].n_follow_ups < 7){
            document.getElementById(`question-${question_number}-n_followups`).value = questionnaire.questions[i].n_follow_ups
        }
    }
    
}

function handleFileSelect(event) {
    const reader = new FileReader()
    reader.onload = uploadQuestionnaire;
    reader.readAsText(event.target.files[0])
}

function uploadQuestionnaire(event){
    questionnaire = JSON.parse(event.target.result);
    loadQuestionnaire(questionnaire)
    localStorage.setItem("questionnaire",JSON.stringify(questionnaire))
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function getSelectIdAndValue(){
	var selects = document.getElementsByClassName("question_block");
	var id = select.id;
	var value = select.value;
	alert("id: " + id + " value: " + value);
}

function getTextareaIdAndValue(){
	var textarea = document.getElementById("textarea");
	var id = textarea.id;
	var value = textarea.value;
	alert("id: " + id + " value: " + value);
}

function getTextInputIdAndValue(){
	var textInput = document.getElementById("textInput");
	var id = textInput.id;
	var value = textInput.value;
	alert("id: " + id + " value: " + value);
}

const topic = document.getElementById('topic')
const context = document.getElementById('context')

function getQuestionInfo(){
    let questionnaire = {}
    // get the topic
    questionnaire.topic = topic.value
    questionnaire.context = context.value
    let question_blocks = document.getElementsByClassName("question_block");
    // loop through the question blocks and get the goodies
    questionnaire.questions = []
    for(let i=0;i<question_blocks.length;i++){
        j = i+1
        let question_text = document.getElementById(`question-${j}-text`).value
        let n_follow_ups = document.getElementById(`question-${j}-n_followups`).value
        if( question_text.trim() != ""){
            q_block = {}
            q_block.question_text = question_text
            q_block.n_follow_ups = n_follow_ups
            questionnaire.questions.push(q_block)
        }
        
    }
    return(questionnaire)
}

function createHumanMessage(message) {
    var row = document.createElement("div");
    row.className = "row";
  
    var col1 = document.createElement("div");
    col1.className = "col s4";
  
    var col2 = document.createElement("div");
    col2.className = "col s8";
  
    var card = document.createElement("div");
    card.className = "card blue-grey darken-1";
  
    var cardContent = document.createElement("div");
    cardContent.className = "card-content white-text";
  
    var p = document.createElement("p");
    p.className = "left-align";
    p.innerHTML = message;
  
    cardContent.appendChild(p);
    card.appendChild(cardContent);
    col2.appendChild(card);
    row.appendChild(col1);
    row.appendChild(col2);
  
    return row;
}

function createAIMessage(message) {
    var row = document.createElement("div");
    row.className = "row";
  
    var col = document.createElement("div");
    col.className = "col s8";
  
    var card = document.createElement("div");
    card.className = "card #ef6c00 orange darken-3";
  
    var cardContent = document.createElement("div");
    cardContent.className = "card-content white-text";
  
    var p = document.createElement("p");
    p.className = "left-align";
    p.innerHTML = message;

    var col1 = document.createElement("div");
    col1.className = "col s4";
  
    cardContent.appendChild(p);
    card.appendChild(cardContent);
    col.appendChild(card);
    row.appendChild(col);
    row.appendChild(col1);
  
    return row;
  }



function calculateCost(tokens){
    return(tokens/1000*0.02)
}

async function generateCompletions(
        apiKey,
        org_key,
        prompt,
        temperature = 0.7,
        maxTokens = 120,
        topP = 1,
        frequencyPenalty = 0,
        presencePenalty = 0,
        stop = ['\n']
    ) {
    const endpoint = "https://api.openai.com/v1/completions";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "OpenAI-Organization": org_key,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: temperature,
        max_tokens: maxTokens,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        stop: stop
      })
    };
    try {
      const response = await fetch(endpoint, options);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
}

function constructPrompt(){
    let c = questionnaire.context
    let t = questionnaire.topic
    let conv = conversation.join("\n")
    let question_text = questionnaire.questions[q_no-1].question_text

    prompt_text = `${c}\n\n${question_text}\n\nHuman: Hi!\n${conv}\nAI:`
    prompt_text = prompt_text.replace(/<TOPIC>/g, t)
    return(prompt_text)
}

function newComment(comment){
    if(comment.trim() !=""){
        if(!ai_turn){
            overlay.style.display = 'flex'
            let new_message = createHumanMessage(comment)
            let prefix = "Human: "
            let chatlog = document.getElementById('chatlog')
            chatlog.prepend(new_message)
            conversation.push(`${prefix}${comment.trim()}`)
            chatbox.value = ""
            chatlog.scrollTop = chatlog.scrollHeight;
            askAI().then(function(result){
                newAIComment(result)
                ai_turn = false
                overlay.style.display = 'none'
            })
        }
    }
    
}

function newAIComment(comment, fresh=false){
    if(ai_turn){
        let new_message = createAIMessage(comment)
        prefix = "AI: "
        let chatlog = document.getElementById('chatlog')
        if(!fresh){
            chatlog.prepend(new_message)
        }else{
            chatlog.innerHTML = new_message
        }
        
        conversation.push(`${prefix}${comment.trim()}`)
        chatbox.value = ""
        chatlog.scrollTop = chatlog.scrollHeight;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function askAI(){
    // we need to check if follow_up_no < max_follow_up_no. If its not, q_no++
    console.log(q_no)
    console.log(max_follow_up_no)
    console.log(follow_up_no)
    if(survey_active){
        document.getElementById('chatbox').disabled = false
        if(follow_up_no >= max_follow_up_no){
            q_no++
            // check q_no not greater than length of questions
            if(q_no > questionnaire.questions.length){
                //we return
                await sleep(1000)
                document.getElementById('chatbox').disabled = true
                goodbye_test = "Thats all the questions I have for you - thank you so much for your time! Bye 👋😊"
                //conversation.push(goodbye_test)
                survey_active = false
                

                return(goodbye_test)
            }
            // need a new max fups
            max_follow_up_no = parseInt(questionnaire.questions[q_no-1].n_follow_ups)
            follow_up_no = -1 // since we are starting again - question that has just been asked is original not follow up
        }
        // now, get the prompt
        p = constructPrompt()
        // here we would send it off to open ai and get the response
        // deal with things like <CONFUSION> here
        r = generateCompletions(api_key,org_key, p)
        r_text = r.then(function(result){
            if('error' in result){
                response_text = "error"
                follow_up_no++
                newAIComment(response_text)
                ai_turn = false
                return(response_text)
            }else{
                response_text = `${result.choices[0].text}`
                cost = calculateCost(result.usage.total_tokens)
                session_cost = session_cost+cost
                document.getElementById('costbox').innerHTML = `conversation cost: $${session_cost.toFixed(3)}`
                follow_up_no++
                newAIComment(response_text)
                ai_turn = false
                return(response_text)
            }
        })
        
        
        return(r_text)
        
    }
}

async function clearConvo(){
    overlay.style.display = 'flex'
    document.getElementById('chatlog').innerHTML = ""
    conversation = []
    // keep track of question number + follow ups
    q_no = 1
    follow_up_no = 0
    max_follow_up_no = parseInt(questionnaire.questions[0].n_follow_ups)
    // keep track of conversation cost
    conversation_cost = 0
    survey_active = true
    document.getElementById('costbox').innerHTML = `conversation cost: $${session_cost.toFixed(3)}`
    return
}

function makeFirstComment(){
    p = constructPrompt() + '👋 Hi there!'
    if(api_key.trim() != "" & org_key.trim() != ""){
        r = generateCompletions(api_key,org_key, p)
        r.then(function(result){
            if('error' in result){
                ai_turn = true
                newAIComment("Please check your API key and Org Key in the config page - its possible you have entered it incorrectly.")
                ai_turn = false
            }else{
                response_text = `👋 Hi there! ${result.choices[0].text}`
                session_cost = session_cost+cost
                document.getElementById('costbox').innerHTML = `conversation cost: $${session_cost.toFixed(3)}`
                ai_turn = true
                newAIComment(response_text)
                ai_turn = false
                conversation.push(`AI: ${response_text}`)
            }
            
        })
    }else{
        ai_turn = true
        newAIComment("Please input your API key and Org Key in the config page before the chat can begin.")
        ai_turn = false
    }
    //overlay.style.display = 'none'
    
}

var questionnaire;

var default_questionnaire = {
    "topic": "non-alcoholic beers",
    "context": "You are a helpful AI designed by marketing professionals to get information from consumers in a natural, conversational manner. Be polite at all times, and thank them for their answers and time when appropriate. Act like they are a good friend of yours. Use emojis to indicate emotional responses to what the human says to you.\n\nYou are interested in their opinions on <TOPIC>. You will ask follow up questions - but those follow up questions should be designed to get NEW information they haven't told you yet. Don't repeat questions you've already asked. You should ONLY reply with questions. ",
    "questions": [
        {
            "question_text": "Find out if they buy non-alcoholic beers regularly. Ask relevant follow up questions to get more information based on their replies - for example, you might want to find out if they buy alcohol containing beers if they don't purchase non-alcoholic ones, or which <TOPIC> they purchase if they don't mention any brands in their answer.",
            "n_follow_ups": "2"
        },
        {
            "question_text": "Depending on their previous answers:\n\n- If they said they buy non-alcoholic beers, ask them what they like about the product they buy. You could follow up by asking what you would improve about the product.\n\n- If they said they don't buy non-alcoholic beers, ask them what would convince them to buy non-alcoholic beers. Follow up with a relevant question to get more new information.",
            "n_follow_ups": "1"
        },
        {
            "question_text": "Ask them how the felt about the survey experience on a scale from 1 to 10, 1 being bad, 10 being excellent. Follow up with a question asking why they felt the way they did, or how the survey could be improved.",
            "n_follow_ups": "1"
        }
    ]
}

if (localStorage.getItem("questionnaire") === null) {
    questionnaire = default_questionnaire
    localStorage.setItem("questionnaire",JSON.stringify(questionnaire))
}else{
    questionnaire = JSON.parse(localStorage.getItem("questionnaire"))
}
  

// create a conversation object. List of strings
var conversation = []
// keep track of question number + follow ups
var q_no = 1
var follow_up_no = 0
var max_follow_up_no = 0
// keep track of conversation cost
var conversation_cost = 0
var session_cost = 0

// whose turn is it?
var ai_turn = true
// false once survey ends
var survey_active = true

var api_key = "";
var org_key = "";

var chatbox;
var overlay;
var p;

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById('chatbox').disabled = true
    // set up a few event listeners
    document.getElementById('add-q-button').addEventListener("click", function(){addQuestionBlock()}, false)
    document.getElementById('remove-q-button').addEventListener("click", function(){removeQuestionBlock()}, false)
    
    document.getElementById('update-config').addEventListener('click', function(){
        questionnaire = getQuestionInfo()
        localStorage.setItem("questionnaire",JSON.stringify(questionnaire))
        clearConvo().then(function(){
            makeFirstComment()
            document.getElementById('chatbox').disabled = false
            overlay.style.display = 'none'
            instance.select('test-swipe-1')
        })
        
    })

    document.getElementById('download-config').addEventListener('click', function(){
        download("q_config.json", JSON.stringify(questionnaire))
    })

    document.getElementById('download-convo-button').addEventListener('click', function(){
        download("conversation.txt", conversation.join("\n"))
    })

    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false)

    document.getElementById("reset-button").addEventListener('click', function(){
        //reset the conversation with async to be sure about orders of stuff
        clearConvo().then(function(){
            makeFirstComment()
            document.getElementById('chatbox').disabled = false
            overlay.style.display = 'none'
        })
        
    })

    document.getElementById("api-key").addEventListener("change", function(e){api_key = e.target.value.trim()})
    document.getElementById("org-key").addEventListener("change", function(e){org_key = e.target.value.trim()})

    chatbox = document.getElementById('chatbox')

    document.getElementById('submit-message').addEventListener("click", function(){
        newComment(chatbox.value);
        ai_turn = !ai_turn
    })

    
    chatbox.addEventListener("keydown", function(e){
        if (e.key == "Enter") {
            // Cancel the default action, if needed
            e.preventDefault();
            // Trigger the button element with a click
            document.getElementById("submit-message").click();
          }
    }, false);

    overlay = document.getElementById('overlay')
    // need to check localstorage. if its there, load in questionnaire and 
    // update the config page (this needs a new function). Otherwise, use the defaults.
    loadQuestionnaire(questionnaire)
    localStorage.setItem("questionnaire",JSON.stringify(questionnaire))
    max_follow_up_no = parseInt(questionnaire.questions[0].n_follow_ups)
    //first comment in convo
    makeFirstComment()
    overlay.style.display = 'none'
    document.getElementById('costbox').innerHTML = `conversation cost: $${session_cost.toFixed(3)}`
    
});
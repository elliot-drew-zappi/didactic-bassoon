// shit version of components

// create a conversation object. List of strings
var conversation = []
// keep track of question number + follow ups
var q_no = 1
var follow_up_no = -1
console.log(follow_up_no)
var max_follow_up_no = 0
// keep track of conversation cost
var conversation_cost = 0

// whose turn is it?
var ai_turn = true
// false once survey ends
var survey_active = true

var api_key = "";
var org_key = "";

var chatbox;
var overlay;
var p;

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

    var row_fup = document.createElement("div");
    row_fup.className = "row";
    question_block.appendChild(row_fup);

    var col_fup_1 = document.createElement("div");
    col_fup_1.className = "col s2";
    row_fup.appendChild(col_fup_1);
  
    var input_field_fup = document.createElement("div");
    input_field_fup.className = "input-field col s8";
    row_fup.appendChild(input_field_fup);

    var textarea_fup = document.createElement("textarea");
    textarea_fup.id = "followup-" + question_number + "-text";
    textarea_fup.className = "materialize-textarea";
    input_field_fup.appendChild(textarea_fup);
  
    var label_fup = document.createElement("label");
    label_fup.setAttribute("for", "followup-" + question_number + "-text");
    label_fup.innerHTML = "Followup Instructions:";
    input_field_fup.appendChild(label_fup);

    var col_fup_2 = document.createElement("div");
    col_fup_2.className = "col s2";
    row_fup.appendChild(col_fup_2);

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
  
    for (var i = 0; i <= 6; i++) {
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
    model_box.value = questionnaire.model  !== undefined ? questionnaire.model  : chosen_model;
    chosen_model = model_box.value
    temperature_box.value = questionnaire.temperature  !== undefined ? questionnaire.temperature  : chosen_temperature;
    chosen_temperature = parseFloat(temperature_box.value)
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

        document.getElementById(`question-${question_number}-text`).value = questionnaire.questions[i].additional_instructions
        document.getElementById(`followup-${question_number}-text`).value = questionnaire.questions[i].followup_instructions
        if(questionnaire.questions[i].n_follow_ups >= 0 & questionnaire.questions[i].n_follow_ups < 7){
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


const topic = document.getElementById('topic')
const context = document.getElementById('context')

function getQuestionInfo(){
    let questionnaire = {}
    // get the topic
    questionnaire.model = chosen_model
    questionnaire.temperature = chosen_temperature
    questionnaire.topic = topic.value
    questionnaire.context = context.value
    let question_blocks = document.getElementsByClassName("question_block");
    // loop through the question blocks and get the goodies
    questionnaire.questions = []
    for(let i=0;i<question_blocks.length;i++){
        j = i+1
        let additional_instructions = document.getElementById(`question-${j}-text`).value
        let followup_instructions = document.getElementById(`followup-${j}-text`).value
        let n_follow_ups = document.getElementById(`question-${j}-n_followups`).value
        if( additional_instructions.trim() != ""){
            q_block = {}
            q_block.additional_instructions = additional_instructions
            q_block.followup_instructions = followup_instructions
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
    return(tokens/1000*0.002)
}

async function generateCompletions(
        apiKey,
        org_key,
        messages,
        maxTokens = 120,
        topP = 1,
        frequencyPenalty = 0,
        presencePenalty = 0,
        stop = ['\n']
    ) {
    const endpoint = "https://api.openai.com/v1/chat/completions";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "OpenAI-Organization": org_key,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", //hardcoded cos f it
        messages: messages,
        temperature: chosen_temperature,
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
    let additional_instructions = questionnaire.questions[q_no-1].additional_instructions

    prompt_text = `${c}\n\n${additional_instructions}\n\nHuman: Hi!\n${conv}\nAI:`
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
            if(q_no <= questionnaire.questions.length){
                if (follow_up_no == -1){
                    conversation.push({role: "user", content: `User Response: ${comment.trim()}\nInstructions For Response: ${questionnaire.questions[q_no-1].additional_instructions}`})
                }else{
                    conversation.push({role: "user", content: `User Response: ${comment.trim()}\nInstructions For Response: ${questionnaire.questions[q_no-1].followup_instructions}`})
                }
            }else{
                conversation.push({role: "user", content: `User Response: ${comment.trim()}\nInstructions For Response: End of conversation.`})
            }
            chatbox.value = ""
            chatlog.scrollTop = chatlog.scrollHeight;
            ai_turn = true
            askAI()
        }
    }
    
}

function newAIComment(comment, fresh=false){
    let new_message = createAIMessage(comment)
    prefix = "AI: "
    let chatlog = document.getElementById('chatlog')
    if(!fresh){
        chatlog.prepend(new_message)
    }else{
        chatlog.innerHTML = new_message
    }
    
    conversation.push({role: "assistant", content: `${comment.trim()}`})
    chatbox.value = ""
    chatlog.scrollTop = chatlog.scrollHeight;
    ai_turn = false
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function askAI(){
    // check if survey is active
    ai_turn = true
    if(api_key.trim() != "" & org_key.trim() != ""){
        if(survey_active){
            document.getElementById('chatbox').disabled = false
            // check if questions are finished
            if(q_no > questionnaire.questions.length){
                //we return
                sleep(1000)
                document.getElementById('chatbox').disabled = true
                goodbye_test = "Thats all the questions I have for you - thank you so much for your time! Bye 👋😊"
                //conversation.push(goodbye_test)
                survey_active = false
                newAIComment(goodbye_test)
                document.getElementById('chatbox').disabled = true
                overlay.style.display = 'none'
                return(goodbye_test)
            }
            // we need to ask a questions
            // is it the first question?
            response_text = ""
            if(conversation.length == 0){
                conversation = [
                    {role: 'system', content: questionnaire.context.replace(/<TOPIC>/g, questionnaire.topic)},
                ]
                console.log("first comment", q_no, max_follow_up_no, follow_up_no)
                conversation.push({role: "user", content: `User Response: None\nInstructions For Response: ${questionnaire.questions[q_no-1].additional_instructions}`})
                // we need to ask the first question
                //p = constructPrompt()
                // here we would send it off to open ai and get the response
                // deal with things like <CONFUSION> here
                r = generateCompletions(api_key,org_key, conversation)
                r_text = r.then(function(result){
                    if('error' in result){
                        response_text = "error"
                        newAIComment(response_text)
                        
                    }else{
                        response_text = `${result.choices[0].message.content}`
                        cost = calculateCost(result.usage.total_tokens)
                        conversation_cost = conversation_cost+cost
                        document.getElementById('costbox').innerHTML = `conversation cost: $${conversation_cost.toFixed(5)}`
                        newAIComment(response_text)
                        
                        overlay.style.display = 'none'
                    }
                })
            }else{
                // ask the next question - conversation is updated with user response by newcomment func already
                r = generateCompletions(api_key,org_key, conversation)
                r_text = r.then(function(result){
                    if('error' in result){
                        response_text = "error"
                        newAIComment(response_text)
                        
                        overlay.style.display = 'none'
                    }else{
                        response_text = `${result.choices[0].message.content}`
                        cost = calculateCost(result.usage.total_tokens)
                        conversation_cost = conversation_cost+cost
                        document.getElementById('costbox').innerHTML = `conversation cost: $${conversation_cost.toFixed(5)}`
                        newAIComment(response_text)
                        
                        overlay.style.display = 'none'
                    }
                })
            }
            // increment follow up number and q_no if necessary
            follow_up_no++
            console.log(q_no,questionnaire.questions.length, max_follow_up_no, follow_up_no)
            if(follow_up_no >= max_follow_up_no){
                console.log("incrementing q_no")
                q_no++
                follow_up_no = -1 // since we are starting again - next q is not a followup
                if(q_no <= questionnaire.questions.length){
                    max_follow_up_no = parseInt(questionnaire.questions[q_no-1].n_follow_ups)
                }else{
                    max_follow_up_no = 0
                }
            }
            return(response_text)
        }
    }else{
        ai_turn = true
        response_text = "Please input your API key and Org Key in the config page before the chat can begin."
        newAIComment(response_text)
        
        overlay.style.display = 'none'
    }
}

async function clearConvo(){
    overlay.style.display = 'flex'
    document.getElementById('chatlog').innerHTML = ""
    conversation = []
    // keep track of question number + follow ups
    q_no = 1
    follow_up_no = -1
    max_follow_up_no = parseInt(questionnaire.questions[0].n_follow_ups)
    // keep track of conversation cost
    conversation_cost = 0
    survey_active = true
    document.getElementById('costbox').innerHTML = `conversation cost: $${conversation_cost.toFixed(5)}`
    return
}

var chosen_temperature = 0.4;
var chosen_model = "gpt-35-turbo";

var model_choices = ["gpt-35-turbo"]

var questionnaire;

var default_questionnaire = {
    "topic":"TOPIC",
    "context": "PERSONA",
    "questions": [
        {
            "additional_instructions": "INSTRUCTIONS FOR THE FIRST QUESTION IN BLOCK",
            "followup_instructions": "FOLLOWUP INSTRUCTIONS DIFFER POTENTIALLY SO PUT THEM HERE",
            "n_follow_ups": "2"
        },
        {
            "additional_instructions": "INSTRUCTIONS FOR THE FIRST QUESTION IN BLOCK",
            "followup_instructions": "FOLLOWUP INSTRUCTIONS DIFFER POTENTIALLY SO PUT THEM HERE",
            "n_follow_ups": "1"
        },
        {
            "additional_instructions": "INSTRUCTIONS FOR THE FIRST QUESTION IN BLOCK",
            "followup_instructions": "FOLLOWUP INSTRUCTIONS DIFFER POTENTIALLY SO PUT THEM HERE",
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

var temperature_box = document.getElementById("temperature-choice")
var model_box = document.getElementById("model-choice")

document.addEventListener("DOMContentLoaded", function(event) {

    temperature_box.addEventListener("change", function(e){
        let tmp_temp = e.target.value;
        if (tmp_temp < 0.0){
            tmp_temp == 0.0;
            temperature_box.value = 0.0
        }else if(tmp_temp > 1.0){
            tmp_temp = 1.0;
            temperature_box.value = 1.0
        }
        chosen_temperature = parseFloat(tmp_temp);
    })

    model_box.addEventListener("change", function(e){
        chosen_model = model_box.value;
    })
    document.getElementById('chatbox').disabled = true
    // set up a few event listeners
    document.getElementById('add-q-button').addEventListener("click", function(){addQuestionBlock()}, false)
    document.getElementById('remove-q-button').addEventListener("click", function(){removeQuestionBlock()}, false)
    
    document.getElementById('update-config').addEventListener('click', function(){
        questionnaire = getQuestionInfo()
        localStorage.setItem("questionnaire",JSON.stringify(questionnaire))
        clearConvo().then(function(){
            askAI()
            instance.select('test-swipe-1')
        })
        
    })

    document.getElementById('download-config').addEventListener('click', function(){
        download("q_config.json", JSON.stringify(questionnaire))
    })

    document.getElementById('download-convo-button').addEventListener('click', function(){
        download("conversation.json", JSON.stringify(conversation))
    })

    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false)

    document.getElementById("reset-button").addEventListener('click', function(){
        //reset the conversation with async to be sure about orders of stuff
        clearConvo().then(function(){
            askAI()
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
    askAI()
    document.getElementById('costbox').innerHTML = `conversation cost: $${conversation_cost.toFixed(5)}`
    
});


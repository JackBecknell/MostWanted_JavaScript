/*
    Author: devCodeCamp
    Description: Most Wanted Starter Code
*/
//////////////////////////////////////////* Beginning Of Starter Code *//////////////////////////////////////////

"use strict";
//? Utilize the hotkey to hide block level comment documentation
////* Mac: Press "CMD"+"K" and then "CMD"+"/"
////* PC: Press "CTRL"+"K" and then "CTRL"+"/"

/**
 * This is the main logic function being called in index.html.
 * It operates as the entry point for our entire application and allows
 * our user to decide whether to search by name or by traits.
 * @param {Array} people        A collection of person objects.
 */
 function app(people) {
    // promptFor() is a custom function defined below that helps us prompt and validate input more easily
    // Note that we are chaining the .toLowerCase() immediately after the promptFor returns its value
    let searchType = promptFor(
        "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
        yesNo
    ).toLowerCase();
    let searchResults;
    // Routes our application based on the user's input
    switch (searchType) {
        case "yes":
            searchResults = searchByName(people);
            break;
        case "no":
            //! TODO: Declare a searchByTrait function //////////////////////////////////////////
            searchResults = searchByTrait(people);
            let foundUsers = searchResults.map(person => `${person.firstName} ${person.lastName}`).join("\n")
            let userInput = promptFor(`Found the following:\n${foundUsers}\n\nDo you want to pick another trait? [Yes/No]: `, yesNo, people)
            while(userInput === "yes"){
                searchResults = searchByTrait(searchResults);
                foundUsers = searchResults.map(person => `${person.firstName} ${person.lastName}`).join("\n")
                userInput = promptFor(`Found the following:\n${foundUsers}\n\nDo you want to pick another trait? [Yes/No]: `, yesNo, people)
            }
            break;
        default:
            // Re-initializes the app() if neither case was hit above. This is an instance of recursion.
            app(people);
            break;
    }

    // Calls the mainMenu() only AFTER we find the SINGLE PERSON
    mainMenu(searchResults, people);

}
// End of app()

/**
 * After finding a single person, we pass in the entire person-object that we found,
 * as well as the entire original dataset of people. We need people in order to find
 * descendants and other information that the user may want.
 * @param {Object[]} person     A singular object inside of an array.
 * @param {Array} people        A collection of person objects.
 * @returns {String}            The valid string input retrieved from the user.
 */
function mainMenu(person, people) {
    let mainMenuCheckList = ['info', 'family', 'descendants', 'restart', 'quit']
    // A check to verify a person was found via searchByName() or searchByTrait()
    let displayOption;
    if (!person[0]) {
        alert("Could not find that individual.");
        // Restarts app() from the very beginning
        return app(people);
    }else if(person.length === 1){
        displayOption = promptFor(
            `Do you want to know ${person[0].firstName} ${person[0].lastName}'s 'info', 'family', or 'descendants'?\nType the option you want or type 'restart' or 'quit'.`, checkListValidator, people, mainMenuCheckList
        );
    }else{
        let displayOptionCheckList = ["restart", "quit"]
        let displayNamesArray = []
        displayNamesArray = person.map (obj => `${obj.firstName} ${obj.lastName}.`).join("\n");
        alert(`The following people matched your trait specifications.\n${displayNamesArray}`);
        

        displayOption = promptFor(`${displayNamesArray}\nWould you like to 'restart' or 'quit'.`, checkListValidator, people, displayOptionCheckList)
    }
    
    // Routes our application based on the user's input
    switch (displayOption) {
        case "info":
            //! TODO: Declare a findPersonInfo function //////////////////////////////////////////
            // HINT: Look for a person-object stringifier utility function to help
            let personInfo = findPersonInfo(person);
            alert(personInfo);
            break;
        case "family":
            //! TODO: Declare a findPersonFamily function //////////////////////////////////////////
            // HINT: Look for a people-collection stringifier utility function to help
            let personFamily = findPersonFamily(person, people);
            alert(personFamily);
            break;
        case "descendants":
            //! TODO: Declare a findPersonDescendants function //////////////////////////////////////////
            // HINT: Review recursion lecture + demo for bonus user story
            let personDescendants = findDescendants(person[0], people);
            alert(personDescendants);
            break;
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        default:
            // Prompt user again. Another instance of recursion
            return mainMenu(person, people);
    }
}
// End of mainMenu()


/**
 * This function is used when searching the people collection by
 * a person-object's firstName and lastName properties.
 * @param {Array} people        A collection of person objects.
 * @returns {Array}            An array containing the person-object (or empty array if no match)
 */
function searchByName(people) {
    let firstName = capitalizeFirstLetter(promptFor("What is the person's first name?", validator, people));
    let lastName = capitalizeFirstLetter(promptFor("What is the person's last name?", validator, people));

    // The foundPerson value will be of type Array. Recall that .filter() ALWAYS returns an array.
    let foundPerson = people.filter(function (person) {
        if (person.firstName === firstName && person.lastName === lastName) {
            return true;
        }
    });
    return foundPerson;
}
// End of searchByName()

/**This function is used when searching the people collection by a 
 * person-object's trait properties.
 * @param {Array} people        A collection of person objects.
 * @return {Array}              An array containing the person-objects (or empty array if no match)
 */

/**
 * This function will be useful for STRINGIFYING a collection of person-objects
 * first and last name properties in order to easily send the information
 * to the user in the form of an alert().
 * @param {Array} people        A collection of person objects.
 */
 function displayPeople(people) {
    alert(people.map(person => `${person.firstName} ${person.lastName}`).join("\n"));
}
// End of displayPeople()

/**
 * This function will be useful for STRINGIFYING a person-object's properties
 * in order to easily send the information to the user in the form of an alert().
 * @param {Object} person       A singular object.
 */
function displayPerson(person) {
    let personInfo = `First Name: ${person.firstName}\n`;
    personInfo += `Last Name: ${person.lastName}\n`;
    //! TODO: finish getting the rest of the information to display //////////////////////////////////////////
    alert(personInfo);
}
// End of displayPerson()

/**
 * This function's purpose is twofold:
 * First, to generate a prompt with the value passed in to the question parameter.
 * Second, to ensure the user input response has been validated.
 * @param {String} question     A string that will be passed into prompt().
 * @param {Function} valid      A callback function used to validate basic user input.
 * @returns {String}            The valid string input retrieved from the user.
 */
function promptFor(question, valid, people, checkList = [], trait) {
    do {
        var response = prompt(question).trim();
    } while (!response || !valid(response, people, checkList, trait) == true);
    return response;
}
// End of promptFor()

/**
 * This helper function checks to see if the value passed into input is a "yes" or "no."
 * @param {String} input        A string that will be normalized via .toLowerCase().
 * @returns {Boolean}           The result of our condition evaluation.
 */
function yesNo(input) {
    return input.toLowerCase() === "yes" || input.toLowerCase() === "no";
}
// End of yesNo()

/**
 * This helper function checks to see if the value passed into input is
 * included in the paramater checkList. if not user
 * gets an alert telling them their input was not accepted.
 * @param {string} input    This comes from promptFor function
 * @param {Array} objects    This comes from Data.js 
 * @returns {boolean}       True if value found, false if not
 */
function checkListValidator(input, checkList, people) {
    let userInput = input.toLowerCase()
    if (checkList.includes(userInput)) {
        return true
    }else{
        alert("Improper Input")
        return false
    }
}
// End of checkListValidator()

/**
 * This helper function checks user input against all of the people
 * For the specific trait being passed into it. If it's not
 * found user gets an alert telling them their input was not accepted.
 * @param {string} input    This comes from promptFor function
 * @param {Array} people    This comes from Data.js
 * @param {Array} nothing   Imagine it doesn't exist :D   
 * @returns {boolean}       True if value found, false if not
 */
function validateTrait(input, people, pointlessList, trait) {     
    let peopleTrait = people.map(person => person[trait])
    if (peopleTrait.includes(input)) {
        return true
    }else{
        return false
    }
}
//End of validateTrait()

/**
 * This helper function acts as a validator and a prompt inspector 
 * for using parent name or spouse name as to find the person while
 * searching by trait.
 * @param {Array} people    This comes from Data.js 
 * @param {String} relationship     Used for finding return value by trait. 
 * @param {Array} relationsFirstLastName    Holds first and last name from family member(spouse/parent) 
 * @returns     False(if name isn't valid) or a person object. 
 */
function validateByName(people, relationship, relationsFirstLastName) {
    let returnValue;
    let peoplesFirst = people.map(person => person.firstName);
    let peoplesLast = people.map(person => person.lastName)
    if (peoplesFirst.includes(relationsFirstLastName[0])) {
        if (peoplesLast.includes(relationsFirstLastName[1])) {
            let returnValue
            let familyMember = people.filter(person => (person.firstName === relationsFirstLastName[0] && person.lastName === relationsFirstLastName[1]))
            if ([relationship] === "parents"){     
                returnValue = people.filter(person => (person[relationship][0] === familyMember[0].id || person[relationship][1] === familyMember[0].id));
            }else{
                returnValue = people.filter(person => (person[relationship] === familyMember[0].id));
            }
            return returnValue
        }else{
            alert('Check input spelling for Last Name.')
            return false 
        }
    }else{
        alert('Check input spelling for First Name.')
        return false
    }
         
}
//End of validateByName()

//////////////////////////////////////////* End Of Starter Code *//////////////////////////////////////////
// Any additional functions can be written below this line 👇. Happy Coding! 😁

function searchByTrait(people) {
    let traitCheckList = ["gender", "dob", "height", "weight", "eyecolor", "eye color", "eyes color", "occuption", "parent", "parents", "currentspouse", "current spouse", "spouse"]
    let trait = promptFor("What is the type of trait you want to search by?\nTraits:\nGender, DOB, Height, Weight, Eyecolor, Occuption, Parents, Current Spouse : ", checkListValidator, people, traitCheckList).toLocaleLowerCase()
    let filteredTrait;
    switch (trait) {
        case "gender":
            let genderCheckList = ['male', 'female']
            let gender = promptFor("What is their gender?: ", checkListValidator, people, genderCheckList)
            filteredTrait = filterByTrait(people, "gender", gender);
            break;
        case "dob":
            let dob = promptFor("What is their date of birth?: [M/DD/YYYY]", validateTrait, people, ['nothing'], 'dob')
            filteredTrait = filterByTrait(people, "dob", dob);  
            break;             
        case "height":
            let height =  parseInt(promptFor("What is their height?: ", validateTrait, people, ['nothing'], 'height'))
            filteredTrait = filterByTrait(people, "height", height);
            break;
        case "weight":
            let weight =  parseInt(promptFor("What is their weight?: ", validateTrait, people, ['nothing'], 'weight'))
            filteredTrait = filterByTrait(people, "weight", weight);
            break;
        case "eyecolor":
        case "eye color":
        case "eyes color":
            let eyeColorCheckList = ["brown", "black", "hazel", "blue", "green"]
            let eyecolor =  promptFor("What is their eye color?: ", checkListValidator, people, eyeColorCheckList)
            filteredTrait = filterByTrait(people, "eyeColor", eyecolor);
            break;
        case "occuption":
            let occupationCheckList = ["doctor", "assistant", "politician", "nurse", "landscaper", "programmer", "architect", "student",]
            let occupation =  promptFor("What is their occupation?: ", checkListValidator, people, occupationCheckList)
            filteredTrait = filterByTrait(people, "occupation");
            break;
        case "parents":
        case "parent":
            let children;
            while (children === undefined || children === false) {
                let parentName = []
                parentName.push(capitalizeFirstLetter(prompt("What is the Parent's First Name?: ").toLowerCase()));
                parentName.push(capitalizeFirstLetter(prompt("What is the Parent's Last Name?: ").toLowerCase()));
                children = validateByName(people, 'parents', parentName)
            }
            filteredTrait = children;
            break;
        case "spouse":
        case "current spouse":
            let spouse;
            while (spouse === undefined || spouse === false) {
                let spouseName = []
                spouseName.push(capitalizeFirstLetter(prompt("What is the Spouse's First Name?: ").toLowerCase()));
                spouseName.push(capitalizeFirstLetter(prompt("What is the Spouse's Last Name?: ").toLowerCase()));
                spouse = validateByName(people, 'currentSpouse', spouseName)
            }
            filteredTrait = spouse;
            break;
    }
   
    return filteredTrait;   
}


function filterByTrait(people, trait, input) {
    let result = people.filter((person) => (person[trait] === input));
    return result
};


function findPersonFamily(person, people){
    let personParents = findPersonNameFromPk(person, people, 'parents')
    let personSpouse = findPersonNameFromPk(person, people, 'currentSpouse')
    let personSiblings = findAllSiblings(person, people)
    return `${person[0].firstName} ${person[0].lastName} Family:\n\nParent:\n${personParents}\n\nSpouse:\n${personSpouse}\n\nSiblings:\n${personSiblings}`
}

function findPersonNameFromPk(person, people, trait){
    if(trait === "currentSpouse" && person[0][trait] === null){
        return `No spouse in system.`
    };
    //changed this line V - removed 0 index that came after trait.
    let personNames = people.filter(element => ((element.id == person[0][trait]) || (element.id == person[0][trait]))
    ).map(element => `${element.firstName} ${element.lastName}`);

    if(personNames.length === 0){
        return `No ${trait} in system.`
    }else{
        return personNames;
    };
};


function findAllSiblings(person, people){
    let siblings = people.filter(obj => (obj.parents.includes(person[0].parents[0]) && obj.firstName !== person[0].firstName)  
    ).map(siblingsObj => `${siblingsObj.firstName} ${siblingsObj.lastName}`);
    if(siblings.length === 0){
        return `No Sibling in system.`;
    }else{
        return siblings;
    };
};

function findPersonInfo(person){
    let result = person.map(obj => `First Name: ${obj.firstName}\nLast Name: ${obj.lastName}\nGender: ${obj.gender}\nDOB: ${obj.dob}\nHeight: ${obj.height}\nWeight: ${obj.weight}\nEye Color: ${obj.eyeColor}\nOccupation: ${obj.occupation}`)
    return result
};

function capitalizeFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

/**
 * This function uses a recursive style function to use a person PK to search through all
 * other peoples parents FK's. When there is a hit, the function stores the name of the person
 * in an array to be returned and then runs again with that descendant to check for more descendants.
 * @param {object} person       A singular person.
 * @param {Array}  people       All people from data.js
 */
function findDescendants(person, people){
    let returnValue = []
    let descendantObj;
    let personPk = person.id;
    returnValue = returnValue.concat(people.filter(obj => (obj.parents.includes(personPk))).map(obj => `${obj.firstName} ${obj.lastName}`));
    let children = (people.filter(obj => (obj.parents.includes(personPk))).map(obj => `${obj.firstName} ${obj.lastName}`));
    if (children.length  === 0) {
        return returnValue
    }
    for (let i = 0; i < children.length; i++){
        descendantObj = people.filter(obj => (obj.parents.includes(personPk)));
            returnValue = returnValue.concat(findDescendants(descendantObj[i], people))
    }
    return returnValue;
}
//End of findDescendants()

/**
 * This helper function checks to see if the value passed into input is
 * included in the paramater checkList. if not user
 * gets an alert telling them their input was not accepted.
 * @param {string} input    This comes from promptFor function
 * @param {Array} objects    This comes from Data.js 
 * @returns {boolean}       True if value found, false if not
 */
 function checkListValidator(input, people, checkList) {
    let userInput = input.toLowerCase()
    if (checkList.includes(userInput)) {
        return true
    }else{
        alert("Improper Input")
        return false
    }
}
// End of checkListValidator()

/**
 * This helper function checks user input against all of the people
 * For the specific trait being passed into it. If it's not
 * found user gets an alert telling them their input was not accepted.
 * @param {string} input    This comes from promptFor function
 * @param {Array} people    This comes from Data.js
 * @param {Array} nothing   Imagine it doesn't exist :D   
 * @returns {boolean}       True if value found, false if not
 */
function validateTrait(input, people, pointlessList, trait) {     
    let peopleTrait = people.map(person => person[trait])
    if(trait == "dob"){
        if (peopleTrait.includes(input)) {
            return true
        }else{
            return false
        }
    }else{
        if(peopleTrait.includes(parseInt(input))) {
            return true
        }else{
            return false
        }
    }
}
//End of validateTrait()

/**
 * This helper function acts as a validator and a prompt inspector 
 * for using parent name or spouse name as to find the person while
 * searching by trait.
 * @param {Array} people    This comes from Data.js 
 * @param {String} relationship     Used for finding return value by trait. 
 * @param {Array} relationsFirstLastName    Holds first and last name from family member(spouse/parent) 
 * @returns     False(if name isn't valid) or a person object. 
 */
function validateByName(people, relationship, relationsFirstLastName) {
    let returnValue;
    let peoplesFirst = people.map(person => person.firstName);
    let peoplesLast = people.map(person => person.lastName)
    if (peoplesFirst.includes(relationsFirstLastName[0])) {
        if (peoplesLast.includes(relationsFirstLastName[1])) {
            let returnValue
            let familyMember = people.filter(person => (person.firstName !== relationsFirstLastName[0] && person.lastName === relationsFirstLastName[1]))
            if ([relationship] === "parents"){     
                returnValue = people.filter(person => (person[relationship][0] === familyMember[0].id || person[relationship][1] === familyMember[0].id));
            }else{
                returnValue = people.filter(person => (person[relationship] === familyMember[0].id));
            }  if(returnValue == undefined || returnValue.length === 0){
            return returnValue
            }
        }else{
            alert('Check input spelling for Last Name.')
            return false 
        }
    }else{
        alert('Check input spelling for First Name.')
        return false
    }
         
}



//End of validateByName()

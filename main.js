const WEEK_DAYS = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
}

const showBox = async (box) => {
    const content = box.lastElementChild;
    
    if (!box.classList.replace('closed', 'opened')) {
        box.classList.add('opened')
    }

    box.dataset.opened = 'true';
    content.style.opacity = '1.0'
}

const hideBox = async (box) => {
    const content = box.lastElementChild;
    box.classList.replace('opened', 'closed');
    box.dataset.opened = 'false';    
    content.style.opacity = '0.0' 
}

const shouldUpdateNickname = async () => {
    const date = new Date();
    const day = date.getDay();

    const lastUpdateDate = localStorage.getItem('nicknameUpdatedAt');
    
    const numberOfDaysSinceLastUpdate = 
        await getNumberOfDaysPassedSince(lastUpdateDate);
        
    console.log('last update date:', lastUpdateDate);
    console.log('number of days since last update:', numberOfDaysSinceLastUpdate);

    if (
        day === WEEK_DAYS.wednesday || 
        numberOfDaysSinceLastUpdate >= 4 || 
        day === WEEK_DAYS.saturday
    ) {
        return true;
    }

    return false;
}

const getData = async () => {
    const data = await fetch('./data.json');
    return data.json();
}

const getNumberOfDaysPassedSince = async (date) => {
    const initialDate = new Date(date);
    const currentDate = new Date();

    const diff = currentDate - initialDate;

    return Math.floor(diff / 1000 / 60 / 60 / 24);
}

const getCurrentYear = async () => {
    const date = new Date();
    return date.getFullYear();
}

const getCurrentReasonWhy = async (reasonsWhy) => {
    const numberOfDaysSinceJanuaryFirst = 
        await getNumberOfDaysPassedSince(`01/01/${await getCurrentYear()}`);

    const indexMod42 = numberOfDaysSinceJanuaryFirst % 42;

    return reasonsWhy[indexMod42];
}

const getCurrentMoment = async (moments) => {
    const numberOfDaysSinceJanuaryFirst = 
        await getNumberOfDaysPassedSince(`01/01/${await getCurrentYear()}`);

    const indexMod42 = numberOfDaysSinceJanuaryFirst % 42;

    return moments[indexMod42];
}

const getCurrentNickname = async (nicknames) => {
    const date = new Date();
    const currentYear = await getCurrentYear();
    const day = date.getDay();

    let currentNickname = '';
    let idx = 0;

    switch(day) {
        case WEEK_DAYS.wednesday:
            const numberOfDaysSinceFirstWednesday = 
                await getNumberOfDaysPassedSince(`01/03/${currentYear}`);

            idx = Math.floor(numberOfDaysSinceFirstWednesday / 7) % 6;
            
            currentNickname = nicknames.wednesday[idx];
            break;
        case WEEK_DAYS.saturday:
            const numberOfDaysSinceFirstSaturday = 
                await getNumberOfDaysPassedSince(`01/06/${currentYear}`);

            idx = Math.floor(numberOfDaysSinceFirstSaturday / 7) % 6;
            
            currentNickname = nicknames.saturday[idx];
            break;
        default:
    }

    if (currentNickname) {
        localStorage.setItem('currentNickname', currentNickname);
        localStorage.setItem('nicknameUpdatedAt', new Date().toDateString());
        return currentNickname;
    }
    
    return localStorage.getItem('currentNickname');
}

const updateGreeting = async () => {
    const date = new Date();
    const hours = date.getHours();
    const greeting = document.querySelector('.greeting');

    if (hours >= 0 && hours < 5) {
        greeting.textContent = `boa madrugada, flor da madrugada`;
    } else if (hours >= 5 && hours < 12) {
        greeting.textContent = `bom dia, flor do dia`;
    } else if (hours >= 12 && hours < 18) {
        greeting.textContent = `boa tarde, flor da tarde`;
    } else {
        greeting.textContent = `boa noite, flor da noite`;
    }
}

const updateReasonsWhy = async (reasonsWhy) => {
    const reasonWhyBox = document.querySelector('#reasons-why');
    const reasonWhyContent = reasonWhyBox.lastElementChild;

    reasonWhyContent.textContent = await getCurrentReasonWhy(reasonsWhy);
}

const updateMoment = async (moments) => {
    const momentBox = document.querySelector('#moments');
    const momentContent = momentBox.lastElementChild;

    momentContent.textContent = await getCurrentMoment(moments);
}

const updateNickname = async (nicknames) => {
    const nicknameBox = document.querySelector('#nickname');
    const nicknameContent = nicknameBox.lastElementChild;

    nicknameContent.textContent = await getCurrentNickname(nicknames);
}

const main = async () => {
    const data = await getData();

    await updateGreeting();

    if (await shouldUpdateNickname()) {
        await updateNickname(data.nicknames);
    }

    await updateMoment(data.moments);
    await updateReasonsWhy(data.reasonsWhy);

    const reasonWhyBox = document.querySelector('#reasons-why');
    const momentBox = document.querySelector('#moments');

    reasonWhyBox.addEventListener('click', () => {
        const reasonWhyBox = document.querySelector('#reasons-why');

        if (reasonWhyBox.dataset.opened == 'false') {
            showBox(reasonWhyBox);
        } else {
            hideBox(reasonWhyBox);    
        }
    });
    momentBox.addEventListener('click', () => {
        const momentBox = document.querySelector('#moments');

        if (momentBox.dataset.opened == 'false') {
            showBox(momentBox);
        } else {
            hideBox(momentBox);    
        }
    });   
}

main();
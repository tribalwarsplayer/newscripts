Memo.toggleEdit()

//get id of current tab
let message_id = $('.memo-tab-selected')[0].id.split('_')[1]

const AT_PLUS_SPACE = 6;

let message_box = document.getElementById(`message_${message_id}`);

let attacks_per_line = message_box.innerHTML.split('\n');
let time_of_attacks = attacks_per_line.map(line => {
  let at = line.indexOf("ekkor");
  return [new Date(line.slice(at+AT_PLUS_SPACE)), line];
});

//sort based on time
time_of_attacks.sort((a, b) => a[0] < b[0]);
let note = time_of_attacks.map(e => e[1]).join('\n');
message_box.innerHTML = note;


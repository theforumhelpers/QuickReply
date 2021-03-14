// original code https://scratch.mit.edu/discuss/topic/489839/?page=2#post-4968917, edited by 9gr for the forum helpers.
void(async () => { // Make sure there is no result so the page isn't overwritten
    const res = fetch(`https://functionalmetatable.github.io/QuickReply/bookmarklet.json`, {method:"POST"})
    let json = await res.json();
    let messages = Object.value(json);
    (menuItems => {
        let d = document.createElement("div"); // make the menu div
        d.setAttribute("data-easrng-menu", "1"); // let the CSS see it exists without clashing with on-page styles
        let s = document.createElement("style"); // make a style tag
        s.textContent = "[data-easrng-menubutton]:not(:root) { outline: none; margin: 0px; border: none; " + // add the CSS
                "border-radius: 0px; background: transparent; color: inherit; font: inherit; text" +
                "-align: left; padding: 5px 10px 5px 20px; display: block; user-select: none; max" +
                "-width: 300px; overflow: visible; height: fit-content; transition: none 0s ease " +
                "0s !important; }[data-easrng-menubutton]:not(:root):hover, [data-easrng-menubutt" +
                "on]:not(:root):focus { border: none; border-radius: 0px; background: rgb(200, 20" +
                "0, 201); color: inherit; font: inherit; }[data-easrng-menubutton]:not(:root):dis" +
                "abled { color: rgb(114, 119, 124); background: transparent; cursor: default; poi" +
                "nter-events: none; }[data-easrng-menu]:not(:root) { line-height: 1.45; border: 1" +
                "px solid rgb(218, 220, 224); position: fixed; top: 0px; left: 0px; z-index: 2147" +
                "483647; min-width: 135px; background: rgb(255, 255, 255); padding: 3px 0px; disp" +
                "lay: flex; flex-direction: column; text-align: left; color: rgb(0, 0, 0); font-f" +
                "amily: system-ui, sans-serif; font-size: 13px; box-shadow: rgba(0, 0, 0, 0.557) " +
                "3px 3px 2px -2px; }[data-easrng-blockbg] { position: fixed; top: 0px; left: 0px;" +
                " width: 100%; height: 100%; z-index: 2147483647; }";
        let c = _ => [...document.querySelectorAll("[data-easrng-menu],[data-easrng-blockbg]")].map(e => e.remove()); // this is a function that closes the menu
        d.append(...menuItems.map(e => { // this part turns the menu items into button tags
            let b = document.createElement("button"); // first we make the button
            b.setAttribute("data-easrng-menubutton", "1"); // let the CSS see it exists without clashing with on-page styles
            b.textContent = e.text; // make it have the right text
            b.onclick = a => { // when it is clicked
                a.preventDefault(); // don't reload the page
                a.stopPropagation(); // don't trigger other events
                a.bubbles = false; // don't trigger other events (iirc some browsers need this)
                c(); // close the menu
                e.action() // call the menu item's function
            };
            b.disabled = !e.action; // if there's no action, disable the button
            return b
        }), s);
        d.style.margin = "10px" // make the menu not be so close to the edge
        let b = document.createElement("div"); // make a div that covers the page so we can close the menu by clicking behind it
        b.setAttribute("data-easrng-blockbg", "1"); // let the CSS see it exists without clashing with on-page styles
        b.onclick = c; // when it's clicked, close the menu
        document
            .body
            .append(b, d); // add the menu and the thing that goes behind it to the document
    })(!!location.href.match(/\/\/scratch.mit.edu\/discuss\/topic\//) // if we are on a forum topic ...
        ? [ // make the autofill menu
            {
                text: "Autofill post with" // this is the menu title
            },
            ...messages.map(t => ({ // turn the messages into menu items
                text: t, // with the proper text.
                action: e => { // when one of them is chosen
                    document
                        .querySelector("#reply")
                        .scrollIntoViewIfNeeded(); // scroll the reply box into view
                    document
                        .querySelector("#id_body")
                        .value += "\n" + t // and add the message to it's text.
                }
            }))
        ]
        : [ // if we aren't on a forum topic, tell the user.
            {
                text: "Please use this bookmarklet on a forum topic."
            }
        ]);
})()

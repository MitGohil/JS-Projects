// Fake Ajax request and dummy data saved on front-end

function getRequest(url, callback) {
    var request = url.split('/');
    if (request[1] === 'companies') {
        var resp = fakeData;
    }
    else if (request[1] === 'pixels') {
        var resp = fakeData.companies[request[2]].pixels;
        var id = request[2];
    }
    if (callback) {
        callback(resp, id)
    }
}

function postRequest(data, url) {
    var request = url.split('/');
    if (request[1] === 'companies') {
        var data = parseJsonFromData(data);
        var newCompany = {
            name: data.name,
            address: data.address,
            city: data.city,
            country: data.country,
            tel: data.tel,
            img: data.img,
            id: fakeData.companies.length
        }
        fakeData.companies.push(newCompany);
    }
    else if (request[1] === 'pixels') {
        var newPixel = {
            name: data,
            id: fakeData.companies[request[2]].pixels.length
        }
        fakeData.companies[request[2]].pixels.push(newPixel);
    }
}

function putRequest(data, url) {
    var request = url.split('/');
    var data = parseJsonFromData(data);
    if (request[1] === 'companies') {
        var oldObj = fakeData.companies[request[2]];
        fakeData.companies[request[2]].name = data.name || oldObj.name;
        fakeData.companies[request[2]].address = data.address || oldObj.address;
        fakeData.companies[request[2]].city = data.city || oldObj.city;
        fakeData.companies[request[2]].country = data.country || oldObj.country;
        fakeData.companies[request[2]].tel = data.tel || oldObj.tel;
        fakeData.companies[request[2]].img = data.img || oldObj.img;
    }
}

function deleteRequest(url, callback) {
    var request = url.split('/');
    if (request[1] === 'companies') {
        fakeData.companies.splice([request[2]]);
    }
    if (callback) {
        callback()
    }
}

function parseJsonFromData(data) {
    var newObj = {};
    var data = data.split('&');
    var dataLength = data.length;
    for (var i = 0; i < dataLength; i++) {
        var keyPair = data[i].split('=');
        newObj[keyPair[0]] = keyPair[1];
    };
    return newObj;
}

var fakeData = {
    companies: [
        {
            name: 'Nike',
            address: 'Colosseum 1',
            city: 'Hilversum',
            country: 'Netherlands',
            tel: '+31 35 6266453',
            img: 'https://i.imgur.com/1rDwK2i.jpg',
            id: '0',
            pixels: [
                {
                    name: 'Some product',
                    id: '1'
                },
                {
                    name: 'Another product',
                    id: '2'
                }
            ]
        },
       
    ]
}

//Rendering items and setting event listeners

var advertisersApp = (function () {
    var advertisers;
    var listElement;

    var addAdvPopup = document.getElementById('addCompany');
    var viewPixelsPopup = document.getElementById('pixels');
    var overlay = document.getElementById('overlay');
    var addEditAdvButton = document.getElementById('addEditAdv');
    var addEditAdvForm = document.getElementById('addEditAdvForm');

    function getAdvertisers() {
        getRequest('/companies', renderAdvertisers);
    }

    function getPixels(advId) {
        getRequest('/pixels/' + advId, showPixels)
    }

    function deleteAdv(advId) {
        var deletedAdv = document.getElementById('adv_' + advId);
        deleteRequest('/companies/' + advId);
        deletedAdv.className += ' fadeout';

        var removeTimeout = setTimeout(function () {
            deletedAdv.parentNode.removeChild(deletedAdv);
        }, 1000);
    }

    function deletePix(pixId) {
        deleteRequest('/pixels/' + pixId, renderAdvertisers);
    }

    function addEditAdv(event) {
        event.preventDefault();
        var advId = addEditAdvButton.advId;
        var data = "name=" + addEditAdvForm.name.value +
            "&address=" + addEditAdvForm.address.value +
            "&tel=" + addEditAdvForm.tel.value +
            "&country=" + addEditAdvForm.country.value +
            "&img=" + addEditAdvForm.img.value +
            "&city=" + addEditAdvForm.city.value;
        if (advId) {
            putRequest(data, '/companies/' + advId);
        }
        else {
            postRequest(data, '/companies');
        }
        closePopup(addAdvPopup);
        addEditAdvForm.reset();
        getAdvertisers();
    }

    function addPixel(event, id) {
        var field = event.target;
        field.setAttribute('contenteditable', 'true');
        field.focus();
    }

    function renderAdvertisers(data) {
        var newHtml = '';
        var data = data.companies;
        var dataLength = data.length;
        for (var i = 0; i < dataLength; ++i) {
            newHtml += advTemplate(data[i].id, data[i].name, data[i].address, data[i].city, data[i].country, data[i].tel, data[i].img);
        }
        listElement.innerHTML = newHtml;
        addEvents();
    }

    function showPixels(data, id) {
        var newHtml = '<ul>';
        var dataLength = data.length;
        for (var i = 0; i < dataLength; ++i) {
            newHtml += '<li class="pixel"><span class="title">' + data[i].name + '</span></li>';
        }
        newHtml += '<li class="pixel"><span class="title add" id="addPixel">Add a pixel</span></li></ul>';
        viewPixelsPopup.innerHTML = newHtml;

        addPixelEvents(document.getElementById('addPixel'), id);
    }

    function addPixelEvents(button, id) {
        cb_addEventListener(button, 'click', function (e) {
            addPixel(e, id);
        })

        cb_addEventListener(button, 'keyup', function (e) {
            clearTimeout(fastType);
            var fastType = setTimeout(function () {
                if (e.keyCode === 13) {
                    postRequest(button.innerText, '/pixels/' + id);
                    getPixels(id);
                }
            }, 300)
        })
    }

    function addEvents() {
        var buttons = listElement.getElementsByClassName('button');
        var buttonLength = buttons.length;

        for (var i = 0; i < buttonLength; ++i) {
            if (buttons[i].hasEvent != 'undefined') {
                if (buttons[i].className.indexOf('delete-adv') > -1) {
                    cb_addEventListener(buttons[i], 'click', function () {
                        deleteAdv(this.parentNode.getAttribute('data-id'));
                    })
                }
                else if (buttons[i].className.indexOf('edit-adv') > -1) {
                    cb_addEventListener(buttons[i], 'click', function () {
                        openPopup(addAdvPopup);
                        addEditAdvButton.advId = this.parentNode.getAttribute('data-id');
                    })
                }
                else if (buttons[i].className.indexOf('view-pixels') > -1) {
                    cb_addEventListener(buttons[i], 'click', function () {
                        getPixels(this.parentNode.getAttribute('data-id'));
                        openPopup(viewPixelsPopup);
                    })
                }
            }
        }
    }

    function openPopup(popup) {
        overlay.className += ' above';
        popup.className += ' opened';
    }

    function closePopup(popup) {
        overlay.className = overlay.className.replace('above', '');
        popup.className = popup.className.replace('opened', '');
    }

    var advTemplate = function (id, name, address, city, country, tel, img) {
        var str = '<li class="grid-item" data-id="' + id + '"" id="adv_' + id + '"><div class="background-image" style="background-image: url(' + (img.length ? img : 'https://i.imgur.com/neFtoeI.jpg') + ')"></div><div class="hover-block"> <div class="item-info"><h3 class="item-title">' + name + '</h3>' + (address ? '<p>Address: ' + address + '</p>' : '') + (city ? '<p>City: ' + city + '</p>' : '') + (country ? '<p>Country: ' + country + '</p>' : '') + (tel ? '<p>Tel: ' + tel + '</p>' : '') + '</div><div class="control-buttons" data-id="' + id + '"><button class="button edit-adv">Edit</button><button class="button delete-adv">Delete</button><button class="button view-pixels">View pixels</button></div></div></li>';
        return str;
    }

    function init(wrapper) {
        listElement = wrapper;
        getAdvertisers();

        cb_addEventListener(document.getElementById('openAddCompany'), 'click', function (e) {
            e.stopPropagation();
            openPopup(addAdvPopup);
            addEditAdvButton.advId = null;
        });

        cb_addEventListener(overlay, 'click', function (e) {
            closePopup(addAdvPopup);
            closePopup(viewPixelsPopup);
        });

        cb_addEventListener(addEditAdvButton, 'click', addEditAdv);
    }

    return {
        init: init
    }
})();

// Cross-browser Event Listener
function cb_addEventListener(obj, evt, fnc) {
    if (obj && obj.addEventListener) {
        obj.addEventListener(evt, fnc, false);
        obj.hasEvent = true;
        return true;
    } else if (obj && obj.attachEvent) {
        obj.hasEvent = true;
        return obj.attachEvent('on' + evt, fnc);
    }
    return false;
}

advertisersApp.init(document.getElementById('advertisersList'));

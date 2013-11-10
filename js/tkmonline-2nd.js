window.onload = function () {
    var queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    queue.loadManifest(Tkm.manifest, true);

    view = document.getElementById('view').contentWindow;

    Tkm.ws = new WebSocket(Tkm.wsurl);

    Tkm.ws.onopen = function () {
        Tkm.send('b');
    }

    Tkm.ws.onmessage = function (evnt) {
        var i, foo, bar, optn;

        if (view.uid === null) {
            switch (evnt.data[0]) {
                case 'B':
                    optn = Tkm.splitForSyntax3(evnt.data);
                    if (optn[0] === '')
                        Tkm.userList.length = 0;
                    else
                        Tkm.userList = optn;
                    if (Tkm.userList.length > 0) {
                        document.getElementById('login-users').innerHTML = '';
                        for (i = 0; i < Tkm.userList.length; i++) {
                            foo = Tkm.userList[i].split('%');
                            bar = '<span class="uid">' + foo[0] + '</span>';
                            if (foo.length > 1) bar += '◆' + '<span class="trip">' + foo[1] + '</span>';
                            document.getElementById('login-users').innerHTML += '<li>' + bar + '</li>';
                        }
                    } else {
                        document.getElementById('login-users').innerHTML = '<li>ログイン中のユーザーはいません。</li>';
                    }
                    break;
                case 'C':
                    document.getElementById('login').style.display = 'none';
                    document.getElementById('play').style.display = 'block';
                    view.onLoad();
                    foo = (Tkm.splitForSyntax1(evnt.data)).split('%');
                    view.uid = foo[0];
                    document.getElementById('chat-text').onkeypress = function (e) {
                        if (this.value !== '' && (e.which === 13 || e.keyCode === 13)) {
                            Tkm.send('e' + this.value);
                            this.value = '';
                        }
                    }
                    document.getElementById('chat-silent-btn').onclick = function () {
                        if (this.textContent === 'チャット音') {
                            this.className = 'button button-pill button-flat';
                            this.textContent = 'OFF';
                        } else {
                            this.className = 'button button-pill button-flat-highlight';
                            this.textContent = 'チャット音';
                        }
                    }
                    Tkm.updateUserList();
                    break;
                case 'D':
                    document.getElementById('err-msg').style.display = 'block';
                    break;
            }
        } else {
            switch (evnt.data[0]) {
                case 'B':
                    optn = Tkm.splitForSyntax3(evnt.data);
                    if (optn[0] === '')
                        Tkm.userList.length = 0;
                    else
                        Tkm.userList = optn;
                    Tkm.updateUserList();
                    break;
                case 'E':
                    optn = Tkm.splitForSyntax1(evnt.data);
                    Tkm.userList.push(optn);
                    Tkm.updateUserList();
                    break;
                case 'F':
                    optn = Tkm.splitForSyntax1(evnt.data);
                    for (i = 0; i < Tkm.userList.length; i++) {
                        if (Tkm.userList[i] === optn) {
                            Tkm.userList.splice(i, 1);
                            break;
                        }
                    }
                    Tkm.updateUserList();
                    break;
                case 'G':
                    view.cid = '';
                    Tkm.updateUserList();
                    break;
                case 'H':
                    if (document.getElementById('chat-silent-btn').textContent === 'チャット音') Tkm.sound('chat');
                    optn = Tkm.splitForSyntax2(evnt.data);
                    if (optn[0] === '?')
                        document.getElementById('log').innerHTML += '<span style="color: deeppink;">' + optn[1] + '</span></br>';
                    else
                        document.getElementById('log').innerHTML += '<span class="uid">' + optn[0] + '</span>:' + optn[1] + '</br>';
                    document.getElementById('log').scrollTop = document.getElementById('log').scrollHeight;
                    break;
                case 'I':
                    foo = (Tkm.splitForSyntax1(evnt.data)).split('%');
                    view.cid = foo[0];
                    Tkm.updateUserList();
                    break;
                case 'J':
                    view.onMessage(Tkm.splitForSyntax1(evnt.data));
                    break;
            }
        }

        document.getElementById('login-btn').onclick = function () {
            var login_uid = document.getElementById('login-uid');

            if (login_uid.value !== '') {
                Tkm.send('c' + login_uid.value);
                login_uid.value = '';
            }
        }
    }
}
$(function() {
    if (localStorage.givenVotes == null || localStorage.givenVotes == "") {
        localStorage.givenVotes = 0;
    } 
    if (localStorage.playing != null && localStorage.playing != "" &&
        localStorage.playing != undefined) {
        $("#playing span").text(localStorage.playing);        
    } else {
        $("#playing span").text("Memories - David Guetta");
    }
    console.log("Current user voted: "+localStorage.givenVotes);
    setVote(1, 0);
    setVote(2, 0);
    setVote(3, 0);
    setVote(4, 0);
    setVote(5, 0);
    setVote(6, 0);
    if (localStorage.bestVoteMusicVal == undefined ||
        localStorage.bestVoteMusicVal == null ||
        localStorage.bestVoteMusicVal == ""){
        localStorage.bestVoteMusicVal = 0;
        localStorage.bestVoteMusicId = 0;
    }
    if (localStorage.currentMusicList != 1 &&
        localStorage.currentMusicList != 2){
        localStorage.currentMusicList = 1;
    }
    if (localStorage.givenVotes > 0) {
        $("img[src='votar.png']").css('display', 'none');
    }
    setMusicList();
    var USER_VOTE_LIMIT = 1;

    $(document).on("click", "#vote_buts img", function() {
        if (parseInt(localStorage.givenVotes) < USER_VOTE_LIMIT) {
            $("img[src='votar.png']").css('display', 'none');
            var id = $(this).data("id");
            addVote(id);
            localStorage.givenVotes = parseInt(localStorage.givenVotes)+1;
        }
    });

    function getVote(musicId) {
        return $("#vote_buts .votes[data-id='"+musicId+"']").text();
    }
    function setVote(musicId, value) {
        if (value == null || value == undefined || value == "NaN") {
            eval("localStorage.musicVotes"+musicId+" ="+0);
            return false;
        }
        $("#vote_buts .votes[data-id='"+musicId+"']").text(parseInt(value));
        eval("localStorage.musicVotes"+musicId+" ="+parseInt(value));
    }
    function addVote(musicId) {
        var curVote = parseInt($("#vote_buts .votes[data-id='"+musicId+"']").text());
        $("#vote_buts .votes[data-id='"+musicId+"']").text(curVote+1);
        setVote(musicId, curVote+1);
        if (curVote+1 > localStorage.bestVoteMusicVal) {
            localStorage.playing = $("#vote_buts span[data-id='"+musicId+"']").text();
            localStorage.bestVoteMusicId = musicId;
            localStorage.bestVoteMusicVal = curVote+1;
        }
    }
    function setMusicList() {
        if (parseInt(localStorage.currentMusicList)  == 2) {
            $("#vote_buts").html('<p></p> <span data-id="1">Rehab - Amy Winehouse</span> <div class="goRight" style="top: 453px;"> <img data-id="1" src="votar.png" /> Votos: <div class="votes" data-id="1">0</div> </div> <br /> <span data-id="2">Bohemian Rhapsody - Queen</span> <div class="goRight" style="top: 500px;"> <img data-id="2" src="votar.png" /> Votos: <div class="votes" data-id="2">0</div> </div> <br /> <span data-id="3">Wrecking Ball - Miley Cyrus</span> <div class="goRight" style="top: 548px;"> <img data-id="3" src="votar.png" /> Votos: <div class="votes" data-id="3">0</div> </div> <br />');
            localStorage.currentMusicList = 1;
            setVote(1, 0);
            setVote(2, 0);
            setVote(3, 0);
        } else {
            $("#vote_buts").html('<p></p> <span data-id="4">Set fire to the rain - Adele</span> <div class="goRight" style="top: 453px;"> <img data-id="4" src="votar.png" /> Votos: <div class="votes" data-id="4">0</div> </div> <br /> <span data-id="5">Tears in Heaven - Eric Clapton</span> <div class="goRight" style="top: 500px;"> <img data-id="5" src="votar.png" /> Votos: <div class="votes" data-id="5">0</div> </div> <br /> <span data-id="6">Memories - David Guetta</span> <div class="goRight" style="top: 548px;"> <img data-id="6" src="votar.png" /> Votos: <div class="votes" data-id="6">0</div> </div> <br />');
            localStorage.currentMusicList = 2;
            setVote(4, 0);
            setVote(5, 0);
            setVote(6, 0);
        }
    }
    function changeMusicList() {
        console.log(localStorage.currentMusicList);
        $("#playing span").text(localStorage.playing);
        localStorage.givenVotes = 0;
        $("img[src='votar.png']").css('display', 'inline');
        setMusicList();
        localStorage.bestVoteMusicVal = 0;
        goCountDown();
    }
    function goCountDown() {
        var countdown = new Countdown(30, function(seconds) {
          $("#cnt").text(seconds); 
        }, function() {
            console.log("mudou 1");
            changeMusicList();
        });
    }
    goCountDown();
    //setInterval(changeMusicList,60000);
});
    window.googletag = window.googletag || {};
    googletag.cmd = googletag.cmd || [];
    var pf = new pubfood();
    
    pf.addSlot({
    name: '/191956889/multi-size',
    elementId: 'div-multi-size',
    placementId: 6397188,
    sizes: [
    [300, 250]
    ],
    zone: 400,
    bidProviders: [
    'districtm'
    ]
    });

    window.googletag = window.googletag || {};
    googletag.cmd = googletag.cmd || [];
    var pf = new pubfood();
    pf.prefixDefaultBidKey(false);
    var batch = [];
    // this reporter listens on all events and pushes the event data to a queue 'batch'
    pf.observe(function(event) {
        batch.push(event);
    });
    // this reporter only listens on the 'AUCTION_COMPLETE' event, then loops over and displays the event data
    pf.observe('AUCTION_COMPLETE', function(event) {
        console.log('---------------------------------------');
        for (var i = 0; i < batch.length; i++) {
            console.log('%c' + batch[i].type, 'padding-right:5px;font-weight:bold;display:block;', JSON.stringify(batch[i]));
        }
    });

    pf.observe('AUCTION_POST_RUN', function() {
        googletag.cmd.push(function() {
            if (!pf.getAuctionProvider().getParam('isRefresh')) {
                googletag.display('div-leaderboard');
            }
        });
    });

pf.addBidProvider({
        name: 'districtm',
        init: function(slots, pushBid, done) {
            //dmTotal and dmCount help you know when to fire the done method
             window.dmTotal = window.dmTotal||0, window.dmCount = window.dmCount || 0;

            // we assign the total slot to dmTotal, you might have to tweak this if you are not applying our demand to all slots
            window.dmTotal = slots.length;

            //call back handler for all incoming bids
            window.handleDistrictmCallback = function (jptResponseObj) {
                if (jptResponseObj.result && jptResponseObj.result.cpm && jptResponseObj.result.cpm !== 0) {
                    var responseCPM;
                    var id = jptResponseObj.callback_uid;

                    if (jptResponseObj.result && jptResponseObj.result.cpm) {
                        responseCPM = parseInt(jptResponseObj.result.cpm, 10);
                        responseCPM = responseCPM / 10000;
                        var responseAd = jptResponseObj.result.ad;
                        var adId = jptResponseObj.result.creative_id;

                        var bid = {};
                        bid.winBid = (parseFloat(responseCPM * 0.9).toFixed(2));
                        bid.winBid = parseFloat(2.00).toFixed(2);
                        bid.slotname = id.split('~')[2];
                        bid.adUrl = jptResponseObj.result.ad;
                        bid.trackingUrl = "";
                        bid.callBackId = id.split('~')[0];
                        bid.adSlot = id.split('~')[0];
                        bid.zone = id.split('~')[1];
                        bid.adSize = [jptResponseObj.result.width, jptResponseObj.result.height];
                        bid.ssp = 'appnexus';

                        //register bids for to DM creative
                        window.disttrictmCreative = window.disttrictmCreative || {};
                        window.disttrictmCreative[bid.callBackId] = {
                            'ad': bid.adUrl,
                            'bid':bid.winBid,
                            'height':jptResponseObj.result.height,
                            'width': jptResponseObj.result.width
                        }

                        var slot = {}
                        slot['dm_price'] = bid.winBid;
                        slot['dm_slot']= bid.callBackId;
                        slot['dm_size'] = jptResponseObj.result.width +"x"+ jptResponseObj.result.height;
                        pushBid({
                            slot: bid.slotname ,
                            value: bid.winBid,
                            sizes: bid.adSize,
                            targeting: slot
                            });

                        window.dmCount++;
                        if(window.dmCount === window.dmTotal){
                            done();
                        }

                    }
                }
            }
     //function to handle create render

            window.districtmRender = function(doc, slot){
                try {
                    var creative = window.disttrictmCreative[slot];

                    doc.write('<iframe src="' + creative.ad + '" width="' + creative.width + '" height="' + creative.height + '" marginheight="0" marginwidth="0" scrolling="0" frameborder="0"></iframe>');
                }catch(e){

                }
            }

            this.execute(slots);

        },
        refresh: function(slots, pushBid, done) {
            console.log('bidProvider.refresh.');

        },
        jptCall: function (callBackId, placementId, sizes, memberId, zone, name) {

           var promo_sizes = "";
           var adSize = sizes[0];
           if (sizes.length > 1) {
               promo_sizes += "promo_sizes=";
               for (var i = 1; i < sizes.length; i++) {
                   promo_sizes += sizes[i] + ",";
               }
               promo_sizes = promo_sizes;
               promo_sizes += "&";
           }

           var jpt = 'http' + ('https:' === document.location.protocol ? 's://secure.adnxs.com/jpt?' : '://ib.adnxs.com/jpt?');
           jpt += 'callback=window.handleDistrictmCallback&';
           jpt += 'callback_uid=' + callBackId + '~'+ zone + '~' + name + '&';
           jpt += 'psa=0&';
           jpt += 'zone=' + zone + '&';
           jpt += 'id=' + placementId + '&';
           jpt += 'member_id=' + memberId + '&';
           jpt += 'size=' + adSize + '&';
           jpt += promo_sizes;
           jpt += 'referrer=' + window.location.href;

           console.log(jpt);
           return jpt;
       },
       getAppNexusBid: function (tagSrc) {

           var jptScript = document.createElement('script');
           jptScript.type = 'text/javascript';
           jptScript.async = true;
           jptScript.src = tagSrc;

           var elToAppend = document.getElementsByTagName('head');
           elToAppend = elToAppend.length ? elToAppend : document.getElementsByTagName('body');
           if (elToAppend.length) {
               elToAppend = elToAppend[0];
               elToAppend.insertBefore(jptScript, elToAppend.firstChild);
           }
       },

       execute: function (map) {

               for (var call in map) {
                   var size = [];

                        size.push(map[call].sizes[0][0] + 'x' + map[call].sizes[0][1]);



                   this.getAppNexusBid(this.jptCall(map[call].elementId, map[call].placementId, size, 1908, map[call].zone, map[call].name));
               }

       }
    });

        pf.setAuctionProvider({
        name: 'Google',
        libUri: '//www.googletagservices.com/tag/js/gpt.js',
        init: function(targeting, done) {
            googletag.cmd.push(function() {
                pf.getAuctionProvider().setParam('isRefresh', false);
                var slots = {};
                for (var i = 0; i < targeting.length; i++) {
                    var tgtObject = targeting[i];
                    var gptObject;
                    if (tgtObject.name) {
                        gptObject = googletag.defineSlot(tgtObject.name, tgtObject.sizes, tgtObject.elementId).addService(googletag.pubads());
                        slots[tgtObject.name] = gptObject;
                    } else {
                        gptObject = googletag.pubads();
                    }
                    for (var p in tgtObject.targeting) {
                        gptObject.setTargeting(p, tgtObject.targeting[p]);
                    }
                    pf.getAuctionProvider().setParam('slots', slots);
                }
            });
            googletag.cmd.push(function() {
                googletag.pubads().collapseEmptyDivs();
                googletag.pubads().enableSingleRequest();
                googletag.enableServices();
                done();
            });
        },
        refresh: function(targeting, done) {
            googletag.cmd.push(function() {
                googletag.pubads().clearTargeting();
                googletag.pubads().clear();
            });
            googletag.cmd.push(function() {
                pf.getAuctionProvider().setParam('isRefresh', true);
                var slots = pf.getAuctionProvider().getParam('slots'),
                        refreshSlots = [];
                for (var i = 0; i < targeting.length; i++) {
                    var tgtObject = targeting[i],
                            gptObject = slots[tgtObject.name];
                    gptObject = gptObject ? (refreshSlots.push(gptObject), gptObject) : googletag.pubads();
                    for (var p in tgtObject.targeting) {
                        gptObject.setTargeting(p, tgtObject.targeting[p]);
                    }
                }
                if (refreshSlots.length > 0) {
                    googletag.pubads().refresh(refreshSlots);
                } else {
                    googletag.pubads().refresh();
                }
                done();
            });
        }
    });
    pf.timeout(3000);
    pf.start(Date.now(), function(hasErros, details) {
        if (hasErros) {
            console.log('HAS ERRORS', details);
        }
    });
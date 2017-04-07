$( "document" ).ready( function() 
{
    var domainButton    = $( "#domain-item" );
    var extensionButton = $( "#extension-item" );


    /* Popup.js needs its own versions of functions needing tab identity */

    function domainFromUrl( url )
    {
        var startIndex = url.indexOf( "://" ) + 3;
        var endIndex = url.indexOf( (new RegExp(/[a-z]\//i)).exec( url ) ) + 1;

        if ( startIndex == 2 || endIndex == 0 )
        {
            // not a normal url, return the whole thing
            return url;
        }

        return url.substring( startIndex, endIndex );
    }

    function toggleDomainEnabled( fn )
    {
        chrome.tabs.query( { "active": true, "currentWindow": true }, function ( tabs ) 
        {
            domain = domainFromUrl( tabs[0].url );

            chrome.storage.sync.get( "briticism_blacklist", function( obj ) 
            {
                var index;
                var response;

                var blacklist = ( !obj["briticism_blacklist"] ) ? [] : obj["briticism_blacklist"];

                if ( ( index = blacklist.indexOf( domain ) ) != -1 ) 
                { // blacklist already contains object, remove it
                    blacklist.splice( index, 1 );

                    response = "ENABLED";
                }
                else
                { // blacklist does not already contain object, add it
                    blacklist.push( domain );

                    response = "DISABLED";
                }

                // update settings
                chrome.storage.sync.set( { "briticism_blacklist": blacklist } );

                fn( response );
            } );
        } );
    }

    function isDomainEnabled( fn )
    {
        chrome.tabs.query( { "active": true, "currentWindow": true }, function ( tabs ) 
        {
            domain = domainFromUrl( tabs[0].url );

            chrome.storage.sync.get( "briticism_blacklist", function( obj ) 
            {
                var blacklist = ( !obj["briticism_blacklist"] ) ? [] : obj["briticism_blacklist"];

                if ( blacklist.indexOf( domain ) == -1 )
                { 
                    fn( "ENABLED" );
                }
                else
                {
                    fn( "DISABLED" );
                }
            } );
        } );
    }

    domainButton.click( function( event ) 
    {
        toggleDomainEnabled( function( response )
        {
            var newText;

            if ( response == "ENABLED" )
            {
                newText = "Don't Run Briticism on This Site";
            }
            else if ( response == "DISABLED" )
            {
                newText = "Run Briticism on This Site";
            }

            // update button text
            domainButton.html( newText );
        } );
    } );

    extensionButton.click( function( event )
    {
        chrome.extension.sendMessage( { toggleExtensionEnabled: true }, function( response )
        {
            var newText;

            if ( response.status == "ENABLED" )
            {
                newText = "Disable Briticism on All Pages";
            }
            else if ( response.status == "DISABLED" )
            {
                newText = "Enable Briticism on All Pages";
            }

            // update button text
            extensionButton.html( newText );
        } );
    } );

    // Initialize Domain Button
    isDomainEnabled( function( response )
    {
        var newText;

        if ( response == "ENABLED" )
        {
            newText = "Don't Run Briticism on This Site";
        }
        else if ( response == "DISABLED" )
        {
            newText = "Run Briticism on This Site";
        }

        // update button text
        domainButton.html( newText );
    } );

    // Initialize Extension Button
    chrome.extension.sendMessage( { isExtensionEnabled: true }, function( response )
    {
        var newText;

        if ( response.status == "ENABLED" )
        {
            newText = "Disable Briticism on All Pages";
        }
        else if ( response.status == "DISABLED" )
        {
            newText = "Enable Briticism on All Pages";
        }

        // update button text
        extensionButton.html( newText );
    } );
} );


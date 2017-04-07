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

function isEnabled( domain, fn )
{
    chrome.storage.sync.get( ["briticism_enabled", "briticism_blacklist"], function( obj ) 
    {
        var blacklist = ( !obj["briticism_blacklist"] ) ? [] : obj["briticism_blacklist"];

        if ( blacklist.indexOf( domain ) == -1 && 
             ( obj["briticism_enabled"] === "yes" || !obj["briticism_enabled"] ) )
        { 
            fn( "ENABLED" );
        }
        else
        {
            fn( "DISABLED" );
        }
    } );
}

function isEnabled( domain, fn )
{
    chrome.storage.sync.get( ["briticism_enabled", "briticism_blacklist"], function( obj ) 
    {
        var blacklist = ( !obj["briticism_blacklist"] ) ? [] : obj["briticism_blacklist"];

        if ( blacklist.indexOf( domain ) == -1 && 
             ( obj["briticism_enabled"] === "yes" || !obj["briticism_enabled"] ) )
        { 
            fn( "ENABLED" );
        }
        else
        {
            fn( "DISABLED" );
        }
    } );
}

function isDomainEnabled( domain, fn )
{
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
}

function isExtensionEnabled( fn )
{
    chrome.storage.sync.get( ["briticism_enabled", "briticism_blacklist"], function( obj ) 
    {
        var blacklist = ( !obj["briticism_blacklist"] ) ? [] : obj["briticism_blacklist"];

        if ( obj["briticism_enabled"] === "yes" || !obj["briticism_enabled"] )
        { 
            fn( "ENABLED" );
        }
        else
        {
            fn( "DISABLED" );
        }
    } );
}

function toggleExtensionEnabled( fn )
{
    chrome.storage.sync.get( "briticism_enabled", function( obj ) 
    {
        var response;
        var icon;
        var enabled;

        if ( obj["briticism_enabled"] === "yes"  || !obj["briticism_enabled"] ) 
        {
            icon = "img/icon-19_trans.png";
            enabled = "no";
            response = "DISABLED";
        } 
        else if ( obj["briticism_enabled"] === "no" ) 
        {
            icon = "../img/icon-19.png";
            enabled = "yes";
            response = "ENABLED";
        } 
        else 
        {
            throw "Value in Sync Storage not recognized";
        }

        //set enabled value in sync storage
        chrome.storage.sync.set( { "briticism_enabled": enabled } );

        //set icon
        chrome.browserAction.setIcon( { "path": icon } );

        fn( response );
    } );
}

chrome.extension.onMessage.addListener(
    function( request, sender, sendResponse ) 
    {
        if ( request.isEnabled )
        {
            isEnabled( domainFromUrl( sender.tab.url ), function( response )
            {
                sendResponse( { "status": response } );
            } );
        } 
        else if ( request.isDomainEnabled )
        {
            isDomainEnabled( domainFromUrl( sender.tab.url ), function( response )
            {
                sendResponse( { "status": response } );
            } );
        }
        else if ( request.isExtensionEnabled )
        {
            isExtensionEnabled( function( response )
            {
                sendResponse( { "status": response } );
            } );
        }
        else if ( request.toggleExtensionEnabled )
        {
            toggleExtensionEnabled( function( response )
            {
                sendResponse( { "status": response } );
            } );
        }

        return true;
    }
);







































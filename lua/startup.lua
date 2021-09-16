os.loadAPI("json");
local ws, err = http.websocket("ws://127.0.0.1:8080");
if not ws then
    print(err)
    os.exit();
end
print(">CONNECTED");

ws.send("{\"type\":\"assign\",\"msg\":\"turtle\"}");
while true do
    local _, url, response, isBinary = os.pullEvent("websocket_message");
    local parsedResponse = json.decode(response);

    
    if parsedResponse then
        print(json.encode(parsedResponse));
        if parsedResponse.type == "function" then
            local eval = load(parsedResponse.msg);
            local t = eval();
            print(t)
            ws.send("{\"type\":\"response\",\"msg\":\"" .. tostring(t) .."\"}");
        elseif parsedResponse.type == "label" then 
            os.setComputerLabel(parsedResponse.msg);
        end
    end
    
    
    
    
end
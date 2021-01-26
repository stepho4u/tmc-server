//= require action_cable
$(document).ready(function() {
    var hostCableUrl = window.location.origin + "/cable"
    var cable = ActionCable.createConsumer(`${hostCableUrl}?user_id=${window.userId}`);
    var connection = cable.subscriptions.create(
        { 
            channel: `CourseRefreshChannel`, 
            courseId: `${window.courseId}`
        }, 
        {
            connected() {
                console.log("Socket connected");
            },

            disconnected() {
                connection.unsubscribe();
                console.log("Socket disconnected");
            },

            received(cableData) {
                var refreshDiv = document.getElementById("refresh-progress-div");
                refreshDiv.style.display = "initial";

                if(cableData['message']) {
                    var refreshRow = document.createElement("DIV");
                    refreshRow.classList.add('row');
                    refreshRow.innerHTML = `<div class='col-md-4'>
                                                ${cableData.message}
                                            </div>
                                            <div class='col-md'>
                                                time (ms): ${cableData.time}
                                            </div>
                                            `;
                    refreshDiv.appendChild(refreshRow);

                    var progressBar = document.getElementById('refresh-progress-bar');
                    var newPcg = Math.floor(Number(cableData.percent_done)*100);
                    progressBar.setAttribute('aria-valuenow', newPcg);
                    progressBar.setAttribute('style', 'width:'+ newPcg + '%');
                    progressBar.innerHTML = newPcg + ' %';
                }
                if (Number(cableData.percent_done) === 1) {
                    window.location.href = window.location.href + `?generate_report=${cableData['course_refresh_id']}`;
                }
            }
        }
    );
});
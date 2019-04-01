rm networkadmin.card
composer card delete -c  admin@drugtraceability-network
echo "installing bna......"
composer network install --card PeerAdmin@hlfv1 --archiveFile ./dist/drugtraceability-network.bna
echo "starting network ..."
composer network start --networkName drugtraceability-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
echo "importing card ...."
composer card import --file networkadmin.card
echo "pinging...."
composer network ping --card admin@drugtraceability-network



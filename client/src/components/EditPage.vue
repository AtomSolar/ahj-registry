<template>
  <b-container>
    <b-row v-if="recordLoading">
      <div class="text-center text-primary my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong>&nbsp; Loading...</strong>
      </div>
    </b-row>
    <b-row v-else>
      <b-col>
        <b-form @submit="onSubmit" @reset="onReset">
            <b-tabs card>
              <b-tab title="AHJ" active>
                  <b-form-group id="input-group-1" label-for="input-1">
                    <b-tabs card>
                      <b-card-header header-tag="header" class="p-0" role="tab">
                        <b-button block v-b-toggle.accordion-1 variant="info">AHJ Information</b-button>
                      </b-card-header>
                      <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                        <div v-for="(valueAHJ, nameAHJ) in constants.AHJ_FIELDS" :key=nameAHJ>
                          <b-row v-if="!isObject(AHJ[nameAHJ]) && (mode === 'create' ? nameAHJ !== 'RecordID' : true)">
                            <b-col cols="4">
                              <label>{{ nameAHJ === "RecordID" ? "AHJ ID" : formatFieldNames(nameAHJ) }}:</label>
                            </b-col>
                            <b-col v-if="editPageViewOnly">
                              <label>{{ AHJ[nameAHJ] }}</label>
                            </b-col>
                            <b-col cols="8" v-else>
                              <label v-if="nameAHJ === 'RecordID' || nameAHJ === 'AHJCode'">{{ AHJ[nameAHJ] }}</label>
                              <b-form-select v-else-if="choiceFields.AHJ[nameAHJ]" v-model="AHJ[nameAHJ]" :options="choiceFields.AHJ[nameAHJ]" />
                              <b-form-input v-else v-model="AHJ[nameAHJ]" type="text" :placeholder="getBFormInputPlaceholder(nameAHJ)" />
                            </b-col>
                          </b-row>
                        </div>
                        <b-row>
                          <b-col>
                            <b-button v-if="!editPageViewOnly && AHJ.Address === null" @click="addAddress(AHJ)">Add Address</b-button>
                          </b-col>
                        </b-row>
                        </b-card-body>
                      </b-collapse>
                      <div v-if="AHJ.Address">
                        <b-card-header header-tag="header" class="p-0" role="tab">
                          <b-button block v-b-toggle.accordion-2 variant="info">Address</b-button>
                        </b-card-header>
                        <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                          <b-card-body>
                              <div v-for="(valueAHJAddress, nameAHJAddress) in constants.ADDRESS_FIELDS" :key=nameAHJAddress>
                                <b-row v-if="!isObject(AHJ.Address[nameAHJAddress]) && (mode === 'create' ? nameAHJAddress !== 'RecordID' : true)">
                                  <b-col cols="4">
                                    <label>{{ nameAHJAddress === "RecordID" ? "Address ID" : formatFieldNames(nameAHJAddress) }}:</label>
                                  </b-col>
                                  <b-col v-if="editPageViewOnly">
                                    <label>{{ AHJ.Address[nameAHJAddress] }}</label>
                                  </b-col>
                                  <b-col cols="8" v-else>
                                    <label v-if="nameAHJAddress === 'RecordID'">{{ AHJ.Address[nameAHJAddress] }}</label>
                                    <b-form-select v-else-if="choiceFields.Address[nameAHJAddress]" v-model="AHJ.Address[nameAHJAddress]" :options="choiceFields.Address[nameAHJAddress]" />
                                    <b-form-input v-else v-model="AHJ.Address[nameAHJAddress]" type="text" :placeholder="getBFormInputPlaceholder(nameAHJAddress)" />
                                  </b-col>
                                </b-row>
                              </div>
                              <b-row>
                                <b-col>
                                  <b-button v-if="!editPageViewOnly && AHJ.Address.Location === null" @click="addLocation(AHJ.Address)">Add Location</b-button>
                                </b-col>
                              </b-row>
                          </b-card-body>
                        </b-collapse>
                      </div>
                      <div v-if="AHJ.Address && AHJ.Address.Location">
                        <b-card-header header-tag="header" class="p-0" role="tab">
                          <b-button block v-b-toggle.accordion-3 variant="info">Location</b-button>
                        </b-card-header>
                        <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
                          <b-card-body>
                            <div v-for="(valueAHJAddressLocation, nameAHJAddressLocation) in constants.LOCATION_FIELDS" :key=nameAHJAddressLocation>
                              <b-row v-if="mode === 'create' ? nameAHJAddressLocation !== 'RecordID' : true">
                                <b-col cols="4">
                                  <label>{{ nameAHJAddressLocation === "RecordID" ? "Location ID" : formatFieldNames(nameAHJAddressLocation)  }}:</label>
                                </b-col>
                                <b-col v-if="editPageViewOnly">
                                  <label>{{ AHJ.Address.Location[nameAHJAddressLocation] }}</label>
                                </b-col>
                                <b-col cols="8" v-else>
                                  <label v-if="nameAHJAddressLocation === 'RecordID'">{{ AHJ.Address.Location[nameAHJAddressLocation] }}</label>
                                  <b-form-select v-else-if="choiceFields.Location[nameAHJAddressLocation]" v-model="AHJ.Address.Location[nameAHJAddressLocation]" :options="choiceFields.Location[nameAHJAddressLocation]" />
                                  <b-form-input v-else v-model="AHJ.Address.Location[nameAHJAddressLocation]" type="text" :placeholder="getBFormInputPlaceholder(nameAHJAddressLocation)" />
                                </b-col>
                              </b-row>
                            </div>
                          </b-card-body>
                        </b-collapse>
                      </div>
                    </b-tabs>
                  </b-form-group>
              </b-tab>
              <b-tab title="Contacts">
                <b-form-group id="input-group-1" label-for="input-1">
                  <b-tabs card>
                    <b-tab v-for="i in tabsContact" :key="'dyn-tab-' + i" :title="'Contact ' + getTabTitle('Contact', i)">
                      <b-button size="sm" variant="danger" class="float-right" :disabled="editPageViewOnly" @click="closeTabContact(i)">Delete</b-button>
                      <b-card-header header-tag="header" class="p-0" role="tab">
                        <b-button block v-b-toggle.accordion-4 variant="info">Contact Information</b-button>
                      </b-card-header>
                      <b-collapse id="accordion-4" visible accordion="my-accordion-contact" role="tabpanel">
                        <b-card-body>
                          <div v-for="(valueContact, nameContact) in constants.CONTACT_FIELDS" :key=nameContact>
                            <b-row v-if="!isObject(AHJ.Contacts[i][nameContact]) && (mode === 'create' ? nameContact !== 'RecordID' : true)">
                              <b-col cols="4">
                                <label>{{ nameContact === "RecordID" ? "Contact ID" : formatFieldNames(nameContact)  }}:</label>
                              </b-col>
                              <b-col v-if="editPageViewOnly">
                                <label>{{ AHJ.Contacts[i][nameContact] }}</label>
                              </b-col>
                              <b-col cols="8" v-else>
                                <label v-if="nameContact === 'RecordID'">{{ AHJ.Contacts[i][nameContact] }}</label>
                                <b-form-select v-else-if="choiceFields.Contact[nameContact]" v-model="AHJ.Contacts[i][nameContact]" :options="choiceFields.Contact[nameContact]" />
                                <b-form-input v-else v-model="AHJ.Contacts[i][nameContact]" type="text" :placeholder="getBFormInputPlaceholder(nameContact)" />
                              </b-col>
                            </b-row>
                          </div>
                          <b-row>
                            <b-col>
                              <b-button v-if="!editPageViewOnly && AHJ.Contacts[i].Address === null" @click="addAddress(AHJ.Contacts[i])">Add Address</b-button>
                            </b-col>
                          </b-row>
                        </b-card-body>
                      </b-collapse>
                      <div v-if="AHJ.Contacts[i].Address">
                        <b-card-header header-tag="header" class="p-0" role="tab">
                          <b-button block v-b-toggle.accordion-5 variant="info">Address</b-button>
                        </b-card-header>
                        <b-collapse id="accordion-5" accordion="my-accordion-contact" role="tabpanel">
                          <b-card-body>
                          <div v-for="(valueContactAddress, nameContactAddress) in constants.ADDRESS_FIELDS" :key=nameContactAddress>
                            <b-row v-if="!isObject(AHJ.Contacts[i].Address[nameContactAddress]) && (mode === 'create' ? nameContactAddress !== 'RecordID' : true)">
                              <b-col cols="4">
                                <label>{{ nameContactAddress === "RecordID" ? "Address ID" : formatFieldNames(nameContactAddress) }}:</label>
                              </b-col>
                              <b-col v-if="editPageViewOnly">
                                <label>{{ AHJ.Contacts[i].Address[nameContactAddress] }}</label>
                              </b-col>
                              <b-col cols="8" v-else>
                                <label v-if="nameContactAddress === 'RecordID'">{{ AHJ.Contacts[i].Address[nameContactAddress] }}</label>
                                <b-form-select v-else-if="choiceFields.Address[nameContactAddress]" v-model="AHJ.Contacts[i].Address[nameContactAddress]" :options="choiceFields.Address[nameContactAddress]" />
                                <b-form-input v-else v-model="AHJ.Contacts[i].Address[nameContactAddress]" type="text" :placeholder="getBFormInputPlaceholder(nameContactAddress)" />
                                  </b-col>
                                </b-row>
                              </div>
                              <b-row>
                                <b-col>
                                  <b-button v-if="!editPageViewOnly && AHJ.Contacts[i].Address.Location === null" @click="addLocation(AHJ.Contacts[i].Address)">Add Location</b-button>
                                </b-col>
                              </b-row>
                          </b-card-body>
                        </b-collapse>
                      </div>
                      <div v-if="AHJ.Contacts[i].Address && AHJ.Contacts[i].Address.Location">
                        <b-card-header header-tag="header" class="p-0" role="tab">
                          <b-button block v-b-toggle.accordion-6 variant="info">Location</b-button>
                        </b-card-header>
                        <b-collapse id="accordion-6" accordion="my-accordion-contact" role="tabpanel">
                          <b-card-body>
                            <div v-for="(valueContactAddressLocation, nameContactAddressLocation) in constants.LOCATION_FIELDS" :key=nameContactAddressLocation>
                              <b-row v-if="mode === 'create' ? nameContactAddressLocation !== 'RecordID' : true">
                                <b-col cols="4">
                                  <label>{{ nameContactAddressLocation === "RecordID" ? "Location ID" : formatFieldNames(nameContactAddressLocation)  }}:</label>
                                </b-col>
                                <b-col v-if="editPageViewOnly">
                                  <label>{{ AHJ.Contacts[i].Address.Location[nameContactAddressLocation] }}</label>
                                </b-col>
                                <b-col cols="8" v-else>
                                  <label v-if="nameContactAddressLocation === 'RecordID'">{{ AHJ.Contacts[i].Address.Location[nameContactAddressLocation] }}</label>
                                  <b-form-select v-else-if="choiceFields.Location[nameContactAddressLocation]" v-model="AHJ.Contacts[i].Address.Location[nameContactAddressLocation]" :options="choiceFields.Location[nameContactAddressLocation]" />
                                  <b-form-input v-else v-model="AHJ.Contacts[i].Address.Location[nameContactAddressLocation]" type="text" :placeholder="getBFormInputPlaceholder(nameContactAddressLocation)" />
                                </b-col>
                              </b-row>
                            </div>
                          </b-card-body>
                        </b-collapse>
                      </div>
                    </b-tab>
                    <template v-slot:tabs-end>
                      <b-nav-item role="presentation" :disabled="editPageViewOnly" @click.prevent="newTabContact" href="#"><b>+</b></b-nav-item>
                    </template>
                  </b-tabs>
                </b-form-group>
              </b-tab>
              <b-tab title="Engineering Review Requirements">
                <b-form-group
                      id="input-group-1"
                      label-for="input-1"
                    >
                  <b-tabs card>
                    <b-tab v-for="i in tabsEngReqRev" :key="'dyn-tab-' + i" :title="'Engineering Review Requirement ' + getTabTitle('EngineeringReviewRequirement', i)">
                      <b-row>
                        <b-col>
                          <b-button size="sm" variant="danger" class="float-right" :disabled="editPageViewOnly" @click="closeTabEngReqReq(i)">Delete</b-button>
                        </b-col>
                      </b-row>
                      <div v-for="(valueEngRevReq, nameEngRevReq) in constants.ENGINEERINGREVIEWREQUIREMENTS_FIELDS" :key=nameEngRevReq>
                        <b-row v-if="mode === 'create' ? nameEngRevReq !== 'RecordID' : true">
                          <b-col cols="4">
                            <label>{{ nameEngRevReq === "RecordID" ? "Engineering Review Requirement ID" : formatFieldNames(nameEngRevReq) }}:</label>
                          </b-col>
                          <b-col v-if="editPageViewOnly">
                            <label>{{ AHJ.EngineeringReviewRequirements[i][nameEngRevReq] }}</label>
                          </b-col>
                          <b-col cols="8" v-else>
                            <label v-if="nameEngRevReq === 'RecordID'">{{ AHJ.EngineeringReviewRequirements[i][nameEngRevReq] }}</label>
                            <b-form-select v-else-if="choiceFields.EngineeringReviewRequirement[nameEngRevReq]" v-model="AHJ.EngineeringReviewRequirements[i][nameEngRevReq]" :options="choiceFields.EngineeringReviewRequirement[nameEngRevReq]" />
                            <b-form-input v-else v-model="AHJ.EngineeringReviewRequirements[i][nameEngRevReq]" type="text" :placeholder="getBFormInputPlaceholder(nameEngRevReq)" />
                          </b-col>
                        </b-row>
                      </div>
                    </b-tab>
                    <template v-slot:tabs-end>
                      <b-nav-item role="presentation" :disabled="editPageViewOnly" @click.prevent="newTabEngRevReq" href="#"><b>+</b></b-nav-item>
                    </template>
                  </b-tabs>
                </b-form-group>
              </b-tab>
            </b-tabs>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import constants from "../constants.js";
export default {
  props: [
    'mode',
    'editPageViewOnly',
    'selectedAHJ'
  ],
  data() {
    return {
      constants: constants,
      recordLoading: true,
      editMode: false,
      beforeEditAHJRecord: {},
      EditTypeAndRecordTypeAndRecordID: "",
      requestType: "post",
      tabsContact: [],
      tabCounterContact: 0,
      tabsEngReqRev: [],
      tabCounterEngReqRev: 0,
      AHJ: {},
      unconfirmedRecordEdits: [],
      choiceFields: constants.CHOICE_FIELDS
    }
  },
  mounted() {
    this.initiateMode();
  },
  methods: {
    initiateMode() {
      if (!this.mode) {
        return;
      } else if (this.mode === 'create') {
        this.AHJ = this.deepCopyObject(constants.AHJ_FIELDS);
      } else if (this.mode === 'update') {
        this.AHJ = this.setAHJFieldsFromResponse(this.selectedAHJ);
        // this.getUnconfirmedRecordEdits();
        this.setTabCounts();
        this.recordLoading = false;
      }
    },
    onSubmit() {
      if (this.mode === "create") {
        this.postCreate("AHJ", this.AHJ);
      } else if (this.mode === "update") {
        this.postUpdate("AHJ", this.AHJ, this.AHJ["RecordID"], this.beforeEditAHJRecord);
      }
    },
    onReset() {

    },
    getConfirmedAHJRecord() {
      this.recordLoading = true;
      axios.get(this.$store.state.apiURL + "ahj/" + this.AHJ.RecordID + "/?view=confirmed", {
        headers: {
          Authorization: this.$store.state.loginStatus.authToken
        }
      }).then(response => {
        this.beforeEditAHJRecord = this.setAHJFieldsFromResponse(response.data);
        this.AHJ = this.deepCopyObject(this.beforeEditAHJRecord);
        this.setTabCounts();
        this.recordLoading = false;
      });
    },
    getUnconfirmedRecordEdits() {
      axios.get(this.$store.state.apiURL + "edit/" + "?RecordID__in=" + this.AHJ.RecordID + "&IsConfirmed__in=None", {
        headers: {
          Authorization: this.constants.TOKEN_AUTH
        }
      }).then(response => {
        this.unconfirmedRecordEdits = response.results;
        this.recordLoading = false;
      });
    },
    setTabCounts() {
      this.tabCounterContact = this.AHJ.Contacts.length;
      this.tabsContact = [];
      for (let i = 0; i < this.tabCounterContact; i++) {
        this.tabsContact.push(i);
      }
      this.tabsEngReqRev = [];
      this.tabCounterEngReqRev = this.AHJ.EngineeringReviewRequirements.length;
      for (let i = 0; i < this.tabCounterEngReqRev; i++) {
        this.tabsEngReqRev.push(i);
      }
    },
    setAHJFieldsFromResponse(record) {
      let result = {};
      Object.keys(record).forEach(key => {
        let field = record[key];
        if (field) {
          if (field.hasOwnProperty("Value")) {
            let value = field["Value"];
            if (value && field["RecordID"] === value) {
              key = "RecordID";
            }
            result[key] = value;
          } else if (this.isArray(field)) {
            result[key] = [];
            field.forEach(item => {
              result[key].push(this.setAHJFieldsFromResponse(item));
            });
          } else {
            result[key] = this.setAHJFieldsFromResponse(record[key]);
          }
        } else {
          result[key] = field;
        }
      });
      return result;
    },
    postCreate(RecordType, fields, ParentID, ParentRecordType) {
      let createEditObject = {EditType: "create", RecordType: RecordType}
      if (ParentID && ParentRecordType) {
        createEditObject["ParentID"] = ParentID;
        createEditObject["ParentRecordType"] = ParentRecordType;
      }
      axios.post(this.$store.state.apiURL + "edit/submit/", createEditObject,
        {
          headers: {
            Authorization: this.$store.state.loginStatus.authToken
          }
      }).then(response => {
        let RecordID = response.data["RecordID"];
        fields["RecordID"] = RecordID;
        this.postUpdate(RecordType, fields, RecordID);
      }).catch(error => {
      });
    },
    postUpdate(RecordType, fields, RecordID, beforeEditFields) {
      let updateEditObjects = [];
      Object.keys(fields).forEach(key => {
        let field = fields[key];
        if(field !== null) {
          if (this.isArray(field)) {
            if (this.mode === "update" && beforeEditFields) {
              this.deleteRemovedRecordsInArray(key, field, beforeEditFields);
            }
            for (let i = 0; i < field.length; i++) {
              let subRecordID = field[i]["RecordID"];
              if (subRecordID) {
                this.postUpdate(this.getSingularRecordType(key), field[i], subRecordID, beforeEditFields[key][i]);
              } else {
                this.postCreate(this.getSingularRecordType(key), field[i], RecordID, RecordType);
              }
            }
          } else if (this.isObject(field)) {
            let subRecordID = field["RecordID"];
            if (subRecordID) {
              this.postUpdate(key, field, subRecordID, beforeEditFields[key]);
            } else {
              this.postCreate(key, field, RecordID, RecordType);
            }
          } else if(key === "RecordID" || (this.mode === "create" ? field === "" : false)
            || (this.mode === "update" && beforeEditFields ? this.checkEditMade(fields, beforeEditFields, key) : false)) {
            return;
          } else {
            let updateEditObject = {EditType: "update", RecordType: RecordType, RecordID: RecordID};
            updateEditObject["FieldName"] = key;
            updateEditObject["Value"] = field;
            updateEditObjects.push(updateEditObject);
          }
        }
      });
      if (updateEditObjects.length > 0) {
        axios.post(this.$store.state.apiURL + "edit/submit/", updateEditObjects,
          {
          headers: {
            Authorization: this.$store.state.loginStatus.authToken
          }
        }).then(response => {
          
        }).catch(error => {
        });
      }
    },
    deleteRemovedRecordsInArray(key, field, beforeEditFields) {
      let recordsToDelete = beforeEditFields[key].filter(item => {
        let deleted = true;
        for (let i = 0; i < field.length; i++) {
          if (item["RecordID"] === field[i]["RecordID"]) {
            deleted = false;
          }
        }
        return deleted;
      });
      recordsToDelete.forEach(record => this.postDelete(this.getSingularRecordType(key), record["RecordID"]));
    },
    postDelete(RecordType, RecordID) {
      let deleteEditObject = {EditType: "delete", RecordType: RecordType, RecordID: RecordID};
      axios.post(this.$store.state.apiURL + "edit/submit/", deleteEditObject,
        {
        headers: {
          Authorization: this.$store.state.loginStatus.authToken
        }
      }).then(response => {
        
      }).catch(error => {
      });
    },
    getSingularRecordType(name) {
      if (name === "Contacts") {
        return "Contact";
      } else if (name === "EngineeringReviewRequirements") {
        return "EngineeringReviewRequirement";
      }
    },
    addContact() {
      this.AHJ.Contacts.push(this.deepCopyObject(constants.CONTACT_FIELDS));
    },
    addAddress(parent) {
      parent["Address"] = this.deepCopyObject(constants.ADDRESS_FIELDS);
    },
    addLocation(parent) {
      parent["Location"] = this.deepCopyObject(constants.LOCATION_FIELDS);
    },
    addEngRevReq() {
      this.AHJ.EngineeringReviewRequirements.push(this.deepCopyObject(constants.ENGINEERINGREVIEWREQUIREMENTS_FIELDS));
    },
    newTabContact() {
      this.addContact();
      this.tabsContact.push(this.tabCounterContact++);
    },
    newTabEngRevReq() {
      this.addEngRevReq();
      this.tabsEngReqRev.push(this.tabCounterEngReqRev++);
    },
    closeTabContact(x) {
      for (let i = 0; i < this.tabsContact.length; i++) {
        if (this.tabsContact[i] === x) {
          this.AHJ.Contacts.splice(i, 1);
          this.tabsContact.splice(i, 1);
        }
        for (let i = 0; i < this.tabsContact.length; i++) {
          this.tabsContact[i] = i;
        }
        this.tabCounterContact = this.tabsContact.length;
      }
    },
    closeTabEngReqReq(x) {
      for (let i = 0; i < this.tabsEngReqRev.length; i++) {
        if (this.tabsEngReqRev[i] === x) {
          this.AHJ.EngineeringReviewRequirements.splice(i, 1);
          this.tabsEngReqRev.splice(i, 1);
        }
        for (let i = 0; i < this.tabsEngReqRev.length; i++) {
          this.tabsEngReqRev[i] = i;
        }
        this.tabCounterEngReqRev = this.tabsEngReqRev.length;
      }
    },
    deepCopyObject(objectToCopy) {
      let result = {};
      Object.keys(objectToCopy).forEach(key => {
        let field = objectToCopy[key];
        if (field) {
          if (this.isArray(field)) {
            result[key] = [];
            field.forEach(item => {
              result[key].push(this.deepCopyObject(item));
            });
          } else if(this.isObject(field)) {
            result[key] = this.deepCopyObject(field);
          } else {
            result[key] = field;
          }
        } else {
          result[key] = field;
        }
      });
      return result;
    },
    checkEditMade(before, after, field) {
      return before[field] === after[field]
    },
    isArray(item) {
      return item.constructor === Array;
    },
    isObject(item) {
      return typeof item === "object";
    },
    getBFormInputPlaceholder(fieldName) {
      return "Enter a " + this.formatFieldNames(fieldName) + "...";
    },
    getTabTitle(type, index) {
      if (type === "Contact") {
        let RecordID = this.AHJ.Contacts[index].RecordID;
        if (RecordID) {
          return RecordID;
        } else {
          return "(new)";
        }
      } else if (type === "EngineeringReviewRequirement") {
        let RecordID = this.AHJ.EngineeringReviewRequirements[index].RecordID;
        if (RecordID) {
          return RecordID;
        } else {
          return "(new)"
        }
      }
    },
    formatFieldNames(name) {
      let result = "";
      let index = 0;
      while (name[index] >= 'A' && name[index] <= 'Z') {
        index++;
      }
      index--;
      result += name.substring(0, index);
      if (name.substring(0, 3) === "AHJ") {
        result += "AHJ ";
        name = name.substring(3);
      }
      for (let i = index; i < name.length; i++) {
        if (/([^A-Za-z0-9\.\$]+)|([A-Z])(?=[A-Z][a-z])|([A-Za-z])(?=\$?[0-9]+(?:\.[0-9]+)?)|([0-9])(?=[^\.0-9])|([a-z])(?=[A-Z])/.test(name.substring(index, i))) {
          result += name.substring(index, i - 1) + " ";
          index = i - 1;
        }
      }
      result += name.substring(index, name.length);
      return result;
    }
  },
  computed: {
    modes() {
      if(this.$store.state.loginStatus["isSuper"]) {
        return [
          { value: "update", text: "Edit an existing AHJ..."},
          { value: "create", text: "Submit a new AHJ..."}
        ];
      } else {
        return [
          { value: "update", text: "Edit an existing AHJ..."}
        ];
      }
    }
  }
};
</script>

<style scoped>

.nav-tabs, .nav-link, .nav-link.active {
  padding-left: 10px;
  padding-right: 10px;
}

</style>

import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Button,
  VStack,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  useToast,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import authAxios from "../../AuthAxios";
import { useParams } from "react-router-dom";

// Fields editable
// Same as the previous

const EducationGroup = () => {
  const projectData = JSON.parse(decodeURIComponent(useParams().project));
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  const [formData, setFormData] = useState({
    NAMEOFTHESOCIETY: projectData.NameOfSociety || "",
    dATEOFSUBMISSION: projectData.DateOfSubmission || "",
    TITLEOFTHEPROJECT: projectData.TitleOfProject || "",
    address: projectData.address || "",
    projectInChargeName: projectData.applicant.name || "",
    projectInChargeCellNumber: projectData.applicant.mobile || "",
    projectInChargeEmail: projectData.applicant.email || "",
    overallProjectPeriod: projectData.OverallProjectPeriod || "",
    overallProjectBudget: projectData.OverallProjectBudget || "",
    beneficiariesSupported: projectData.beneficiariesSupported || "",
    outcomeImpact: projectData.outcomeImpact || "",
    projectGoal: projectData.goal || "",
    objectives: projectData.objectives || [""],
    otherActivities: projectData.otherActivities || "",
    monitoringMethods: projectData.monitoringMethods || "",
    evaluationProcess: projectData.evaluationProcess || "",
    conclusion: projectData.conclusion || "",
    projectInChargeAgreement:
      projectData.project_in_charge_agree.agree || false,
    projectInChargeAgreementDate:
      projectData.project_in_charge_agree.date || "",
  });

  // Populate studiesTableData from req
  const [studiesTableData, setStudiesTableData] = useState(
    projectData.targetGroupStudies.map((row) => ({
      serialNo: row.serialNo || "",
      name: row.name || "",
      studyProposed: row.studyProposed || "",
      totalExpense: row.totalExpense || "",
      contribution: row.contribution || "",
      scholarshipEligibility: row.scholarshipEligibility || "",
      expectedAmount: row.expectedAmount || "",
    }))
  );

  // Populate informationTableData from req
  const [informationTableData, setInformationTableData] = useState(
    projectData.targetGroupInformation.map((row) => ({
      serialNo: row.serialNo || "",
      name: row.name || "",
      casteAddress: row.casteAddress || "",
      recommendedBy: row.recommendedBy || "",
      familyBackground: row.familyBackground || "",
    }))
  );

  // Populate tableData from req
  const [tableData, setTableData] = useState(
    projectData.peopleDetails.map((row) => ({
      class: row.class || "",
      totalFemale: row.totalFemale || "",
      totalMale: row.totalMale || "",
      total: row.total || 0,
    }))
  );

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e, index) => {
    console.log(e.target.value);
    const { name, value } = e.target;

    if (name === "objectives") {
      const updatedObjectives = [...formData.objectives];
      updatedObjectives[index] = value;

      setFormData({
        ...formData,
        objectives: updatedObjectives,
      });
    } else {
      formData[name] = value;
      setFormData({ ...formData });
    }
  };

  const handleAddObjective = () => {
    setFormData({
      ...formData,
      objectives: [...formData.objectives, ""], // Add a new empty objective
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Add your form submission logic here
    // for Project Coordinator no logic can be written as of now
    const req = {
      NameOfSociety: formData.NAMEOFTHESOCIETY,
      DateOfSubmission: formData.dATEOFSUBMISSION,
      TitleOfProject: formData.TITLEOFTHEPROJECT,
      address: formData.address,
      OverallProjectPeriod: formData.overallProjectPeriod,
      OverallProjectBudget: formData.overallProjectBudget,
      beneficiariesSupported: formData.beneficiariesSupported,
      outcomeImpact: formData.outcomeImpact,
      goal: formData.projectGoal,
      objectives: formData.objectives,
      peopleDetails: tableData.map((row) => ({
        class: row.class,
        totalFemale: row.totalFemale,
        totalMale: row.totalMale,
        total: row.total,
      })),
      targetGroupInformation: informationTableData.map((row) => ({
        serialNo: row.serialNo,
        name: row.name,
        casteAddress: row.casteAddress,
        recommendedBy: row.recommendedBy,
        familyBackground: row.familyBackground,
      })),
      targetGroupStudies: studiesTableData.map((row) => ({
        serialNo: row.serialNo,
        name: row.name,
        studyProposed: row.studyProposed,
        totalExpense: row.totalExpense,
        contribution: row.contribution,
        scholarshipEligibility: row.scholarshipEligibility,
        expectedAmount: row.expectedAmount,
      })),
      otherActivities: formData.otherActivities,
      monitoringMethods: formData.monitoringMethods,
      evaluationProcess: formData.evaluationProcess,
      conclusion: formData.conclusion,
      project_in_charge_agree: {
        agree: true,
      },
    };

    try {
      const res = await authAxios.put("/projects/editEGApplicant", req);
      console.log(res);
      setIsLoading(false);
      if (res.data.success) {
        showToast({
          title: "Successful submission",
          duration: 5000,
          status: "success",
        });
        setIsSubmitted(true);
      } else {
        showToast({
          title: "Unsuccessful submission",
          duration: 5000,
          status: "error",
        });
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      showToast({
        title: "Unsuccessful submission",
        duration: 5000,
        status: "error",
      });
    }

    // Now you can use this request object to send data to your server for validation.
  };

  const PeopleDetailsTable = () => {
    const handleInputChange = (index, field, value) => {
      const newData = [...tableData];
      newData[index][field] = value;

      // Calculate total for the current row
      if (field === "totalFemale" || field === "totalMale") {
        newData[index].total = calculateTotal(
          parseInt(newData[index].totalFemale) || 0,
          parseInt(newData[index].totalMale) || 0
        );
      }
      console.log(tableData);
      setTableData(newData);
    };

    const handleAddRow = () => {
      setTableData([
        ...tableData,
        { class: "", totalFemale: "", totalMale: "", total: 0 },
      ]);
    };

    return (
      <Box p={4}>
        <Heading as="h1" size="l" mb={6}>
          People Details Table
        </Heading>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Class</Th>
              <Th>Total Female</Th>
              <Th>Total Male</Th>
              <Th>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((row, index) => (
              <Tr key={index}>
                <Td>
                  <Input
                    type="number"
                    value={row.class}
                    onChange={(e) =>
                      handleInputChange(index, "class", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Input
                    type="number"
                    value={row.totalFemale}
                    onChange={(e) =>
                      handleInputChange(index, "totalFemale", e.target.value)
                    }
                  />
                </Td>
                <Td>
                  <Input
                    type="number"
                    value={row.totalMale}
                    onChange={(e) =>
                      handleInputChange(index, "totalMale", e.target.value)
                    }
                  />
                </Td>
                <Td>{row.total}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Button onClick={handleAddRow}>Add Row</Button>
      </Box>
    );
  };

  const calculateTotal = (totalFemale, totalMale) => {
    return parseInt(totalFemale) + parseInt(totalMale);
  };

  const TargetGroupInformationTable = () => {
    const handleInformationInputChange = (index, field, value) => {
      const newData = [...informationTableData];
      newData[index][field] = value;
      setInformationTableData(newData);
    };

    const handleAddInformationRow = () => {
      setInformationTableData([
        ...informationTableData,
        {
          serialNo: informationTableData.length + 1,
          name: "",
          casteAddress: "",
          recommendedBy: "",
          familyBackground: "",
        },
      ]);
    };

    return (
      <Box p={4}>
        <Heading as="h1" size="l" mb={6}>
          Target Group - Information of the Beneficiaries
        </Heading>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>S.No</Th>
              <Th>Name of the Beneficiary</Th>
              <Th>Caste & Address</Th>
              <Th>Who Recommended</Th>
              <Th>Family Background & Need of Support</Th>
            </Tr>
          </Thead>
          <Tbody>
            {informationTableData.map((row, index) => (
              <Tr key={index}>
                <Td>
                  <Input
                    type="number"
                    isRequired
                    value={row.serialNo}
                    readOnly
                  />
                </Td>
                <Td>
                  <Input
                    type="text"
                    isRequired
                    value={row.name}
                    onChange={(e) =>
                      handleInformationInputChange(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                  />
                </Td>
                <Td>
                  <Input
                    type="text"
                    isRequired
                    value={row.casteAddress}
                    onChange={(e) =>
                      handleInformationInputChange(
                        index,
                        "casteAddress",
                        e.target.value
                      )
                    }
                  />
                </Td>
                <Td>
                  <Input
                    type="text"
                    isRequired
                    value={row.recommendedBy}
                    onChange={(e) =>
                      handleInformationInputChange(
                        index,
                        "recommendedBy",
                        e.target.value
                      )
                    }
                  />
                </Td>
                <Td>
                  <Textarea
                    value={row.familyBackground}
                    isRequired
                    onChange={(e) =>
                      handleInformationInputChange(
                        index,
                        "familyBackground",
                        e.target.value
                      )
                    }
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Button onClick={handleAddInformationRow}>Add Row</Button>
      </Box>
    );
  };

  const TargetGroupStudiesTable = () => {
    const handleStudiesInputChange = (index, field, value) => {
      const newData = [...studiesTableData];
      newData[index][field] = value;
      setStudiesTableData(newData);
    };

    const handleAddStudiesRow = () => {
      setStudiesTableData([
        ...studiesTableData,
        {
          serialNo: studiesTableData.length + 1,
          name: "",
          studyProposed: "",
          totalExpense: "",
          contribution: "",
          scholarshipEligibility: "",
          expectedAmount: "",
        },
      ]);
    };

    return (
      <Box p={4} overflowX="auto" maxW="100%">
        <Heading as="h1" size="l" mb={6}>
          Target Group - Studies and Finance Details
        </Heading>

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={4}
        >
          {studiesTableData.map((row, index) => (
            <Box key={index} borderWidth="1px" borderRadius="md" p={2}>
              <Box>S.No: {row.serialNo}</Box>
              <Box>
                <Input
                  type="text"
                  value={row.name}
                  onChange={(e) =>
                    handleStudiesInputChange(index, "name", e.target.value)
                  }
                  placeholder="Name"
                />
              </Box>
              <Box>
                <Input
                  type="text"
                  value={row.studyProposed}
                  onChange={(e) =>
                    handleStudiesInputChange(
                      index,
                      "studyProposed",
                      e.target.value
                    )
                  }
                  placeholder="Study Proposed"
                />
              </Box>
              <Box>
                <Input
                  type="number"
                  value={row.totalExpense}
                  onChange={(e) =>
                    handleStudiesInputChange(
                      index,
                      "totalExpense",
                      e.target.value
                    )
                  }
                  placeholder="Total Expense"
                />
              </Box>
              <Box>
                <Input
                  type="number"
                  value={row.contribution}
                  onChange={(e) =>
                    handleStudiesInputChange(
                      index,
                      "contribution",
                      e.target.value
                    )
                  }
                  placeholder="Contribution"
                />
              </Box>
              <Box>
                <Input
                  type="text"
                  value={row.scholarshipEligibility}
                  onChange={(e) =>
                    handleStudiesInputChange(
                      index,
                      "scholarshipEligibility",
                      e.target.value
                    )
                  }
                  placeholder="Scholarship Eligibility"
                />
              </Box>
              <Box>
                <Input
                  type="number"
                  value={row.expectedAmount}
                  onChange={(e) =>
                    handleStudiesInputChange(
                      index,
                      "expectedAmount",
                      e.target.value
                    )
                  }
                  placeholder="Expected Amount"
                />
              </Box>
            </Box>
          ))}
        </Box>

        <Button onClick={handleAddStudiesRow}>Add Row</Button>
      </Box>
    );
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Heading
          as="h1"
          size="xl"
          mb={6}
          align="center"
          justifyContent="center"
        >
          Education Group Project Application Form
        </Heading>

        {isSubmitted && (
          <Alert status="success" mb={4}>
            <AlertIcon />
            Form submitted successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <VStack align="start" spacing={4} mb={8}>
            {/* NAME OF THE SOCIETY */}
            <FormControl isRequired>
              <FormLabel>NAME OF THE SOCIETY</FormLabel>
              <Input
                type="text"
                name="NAMEOFTHESOCIETY"
                value={formData.NAMEOFTHESOCIETY}
                onChange={handleChange}
                required
              />
            </FormControl>

            {/* DATE OF SUBMISSION */}
            <FormControl isRequired>
              <FormLabel>DATE OF SUBMISSION</FormLabel>
              <Input
                type="date"
                name="dATEOFSUBMISSION"
                value={formData.dATEOFSUBMISSION}
                onChange={handleChange}
                required
              />
            </FormControl>

            {/* TITLE OF THE PROJECT */}
            <FormControl isRequired>
              <FormLabel>TITLE OF THE PROJECT </FormLabel>
              <Input
                type="text"
                name="TITLEOFTHEPROJECT"
                value={formData.TITLEOFTHEPROJECT}
                onChange={handleChange}
                required
              />
            </FormControl>

            {/* ADDRESS*/}
            <FormControl isRequired>
              <FormLabel>ADDRESS</FormLabel>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </FormControl>

            {/* Contacts Table */}
            <Table variant="simple" mb={4}>
              <Thead>
                <Tr>
                  <Th>Role</Th>
                  <Th>Name</Th>
                  <Th>Cell Number</Th>
                  <Th>Email</Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* Project Coordinators */}
                <Tr>
                  <Td>Project Coordinator India</Td>
                  <Td>Sr. Nirmala Mathew</Td>
                  <Td>Not Available</Td>
                  <Td>micostannsindia@gmail.com</Td>
                </Tr>
                <Tr>
                  <Td>Project Coordinator Luzern, Switzerland</Td>
                  <Td>Mr. Samuel Imbach</Td>
                  <Td>Not Available</Td>
                  <Td>s.imbach@mission-stanna.ch</Td>
                </Tr>
              </Tbody>
            </Table>
            {/* Overall Project Period */}
            <FormControl isRequired>
              <FormLabel>Overall Project Period (in months)</FormLabel>
              <Input
                type="number"
                name="overallProjectPeriod"
                value={formData.overallProjectPeriod}
                onChange={handleChange}
                required
              />
            </FormControl>

            {/* Overall Project Budget */}
            <FormControl isRequired>
              <FormLabel>Overall Project Budget</FormLabel>
              <Input
                type="number"
                name="overallProjectBudget"
                value={formData.overallProjectBudget}
                onChange={handleChange}
                required
              />
            </FormControl>

            {/* Number of Beneficiaries supported in the previous years */}
            <FormControl isRequired>
              <FormLabel>
                Number of Beneficiaries supported in the previous years
              </FormLabel>
              <Input
                type="number"
                name="beneficiariesSupported"
                value={formData.beneficiariesSupported}
                onChange={handleChange}
                required
              />
            </FormControl>

            {/* Outcome / Impact in the lives of the passed-out students */}
            <FormControl isRequired>
              <FormLabel>
                Outcome / Impact in the lives of the passed-out students
              </FormLabel>
              <Textarea
                name="outcomeImpact"
                onChange={handleChange}
                value={formData.outcomeImpact}
                required
              />
            </FormControl>

            {/* Goal of the project */}
            <FormControl isRequired>
              <FormLabel>Goal of the project</FormLabel>
              <Textarea
                name="projectGoal"
                onChange={handleChange}
                value={formData.projectGoal}
                required
              />
            </FormControl>
            {/* Objectives of the project */}
            <FormControl isRequired>
              <FormLabel>Objectives of the project</FormLabel>
              <Table variant="simple" mb={4}>
                <Thead>
                  <Tr>
                    <Th>Objective</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {formData.objectives.map((objective, index) => (
                    <Tr key={index}>
                      <Td>
                        <Input
                          type="text"
                          name="objectives"
                          value={objective}
                          onChange={(e) => handleChange(e, index)}
                          required
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Button onClick={handleAddObjective} colorScheme="teal">
                Add Objective
              </Button>
            </FormControl>
            {PeopleDetailsTable()}
            <Heading as="h1" size="xl" mb={6}>
              TARGET GROUP
            </Heading>
            {TargetGroupInformationTable()}
            {TargetGroupStudiesTable()}
            {/* Other Proposed Activities */}
            <FormControl isRequired>
              <FormLabel>
                Apart from academic studies, what are the other proposed
                activities for the overall development of the beneficiary
                individually and as a group?
              </FormLabel>
              <Textarea
                name="otherActivities"
                onChange={handleChange}
                value={formData.otherActivities}
                required
              />
            </FormControl>

            {/* Monitoring Methods */}
            <FormControl isRequired>
              <FormLabel>
                Propose the methods of monitoring the beneficiary's overall
                growth and development:
              </FormLabel>
              <Textarea
                name="monitoringMethods"
                onChange={handleChange}
                value={formData.monitoringMethods}
                required
              />
            </FormControl>

            {/* Evaluation Process and Responsible Person */}
            <FormControl isRequired>
              <FormLabel>
                Mention the process of evaluation of the growth of the
                beneficiaries and who would be responsible.
              </FormLabel>
              <Textarea
                name="evaluationProcess"
                onChange={handleChange}
                value={formData.evaluationProcess}
                required
              />
            </FormControl>

            {/* Conclusion */}
            <FormControl isRequired>
              <FormLabel>Conclusion</FormLabel>
              <Textarea
                name="conclusion"
                onChange={handleChange}
                value={formData.conclusion}
                required
              />
            </FormControl>

            <Heading as="h1" size="xl" mb={6}>
              Signatures
            </Heading>

            {/* Project Coordinator agreement */}
            {/* <FormControl isRequired>
    <Checkbox
      name="projectCoordinatorAgreement"
      onChange={handleChange}
      size="lg"
    >
      The Project Coordinator agree
    </Checkbox>
    <Input
      type="date"
      name="projectCoordinatorAgreementDate"
      onChange={handleChange}
      required
    />
  </FormControl> */}

            {/* Project-In-Charge agreement */}
            <FormControl isRequired>
              <Checkbox
                name="projectInChargeAgreement"
                onChange={handleChange}
                size="lg"
                defaultChecked={formData.projectInChargeAgreement}
              >
                The Project-In-Charge agree
              </Checkbox>
              <Input
                type="date"
                name="projectInChargeAgreementDate"
                onChange={handleChange}
                value={formData.projectInChargeAgreementDate}
                required
              />
            </FormControl>

            {/* Provincial Superior agreement */}
            {/* <FormControl isRequired>
    <Checkbox
      name="provincialSuperiorAgreement"
      onChange={handleChange}
      size="lg"
    >
      The Provincial Superior agree
    </Checkbox>
    <Input
      type="date"
      name="provincialSuperiorAgreementDate"
      onChange={handleChange}
      required
    />
  </FormControl>
           */}
          </VStack>

          {/* Submit Button */}
          <Button colorScheme="blue" type="submit">
            Submit
          </Button>
        </form>
      </Box>
    </ChakraProvider>
  );
};
export default EducationGroup;

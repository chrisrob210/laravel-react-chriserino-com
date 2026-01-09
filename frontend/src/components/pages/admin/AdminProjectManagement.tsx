import { useState } from "react"
import Card from "../../common/Card"
import TextInput from "../../common/TextInput"
import FlexColContainer from "../../common/FlexColContainer"
import Title from "../../common/Title"
export default function AdminProjectManagement() {
    const [projects, setProjects] = useState([]);

    return (
        <FlexColContainer>
            <Title title="Project Management" />
            <Card>
                {/* List All Projects */}
                <div>TEST CARD</div>
                <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod libero a iure quo consequuntur recusandae iste hic atque ducimus ipsam!</div>
            </Card>
        </FlexColContainer>
    )
}
